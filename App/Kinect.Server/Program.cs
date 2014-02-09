using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Kinect;
using Alchemy;
using Alchemy.Classes;
using System.Collections.Concurrent;
using System.Threading;
using Microsoft.Speech.AudioFormat;
using Microsoft.Speech.Recognition;

namespace Kinect.Server
{
    class Program
    {
        //static List<IWebSocketConnection> _clients = new List<IWebSocketConnection>();
        protected static ConcurrentDictionary<string,UserContext> OnlineConnections = new ConcurrentDictionary<string, UserContext>();
        static UserContext connecter = null;
        static bool _serverInitialized = false;

        static Skeleton[] _skeletons = new Skeleton[6];
        
        static double walkThresh = 0.1;
        static double runThresh = 0.5;
        static double tiltSlowThresh = 0.3;
        static double turnSlowThresh = 0.08;
        static double turnFastThresh = 0.2;
        static double armTurnThresh = 0.3;
        static double stopThreshold = 0.20;

        static void Main(string[] args)
        {
            InitilizeKinect();
            InitializeServer();
            SpeechRecognition();
        }

        private static void SpeechRecognition(){
            KinectSensor sensor = (from sensorToCheck in KinectSensor.KinectSensors where sensorToCheck.Status == KinectStatus.Connected select sensorToCheck).FirstOrDefault();
            if (sensor == null)
            {
                /*Console.WriteLine(
                        "No Kinect sensors are attached to this computer or none of the ones that are\n" +
                        "attached are \"Connected\".\n" +
                        "Attach the KinectSensor and restart this application.\n" +
                        "If that doesn't work run SkeletonViewer-WPF to better understand the Status of\n" +
                        "the Kinect sensors.\n\n" +
                        "Press any key to continue.\n"); 
                */
                // Give a chance for user to see console output before it is dismissed
                Console.ReadKey(true);
                return;
            }

            sensor.Start();

            // Obtain the KinectAudioSource to do audio capture
            KinectAudioSource source = sensor.AudioSource;
            source.EchoCancellationMode = EchoCancellationMode.None; // No AEC for this sample
            source.AutomaticGainControlEnabled = false; // Important to turn this off for speech recognition

            RecognizerInfo ri = GetKinectRecognizer();

            if (ri == null)
            {
               // Console.WriteLine("Could not find Kinect speech recognizer. Please refer to the sample requirements.");
                return;
            }

            Console.WriteLine("Using: {0}", ri.Name);

            using (var sre = new SpeechRecognitionEngine(ri.Id))
            {
                var commands = new Choices();
                commands.Add("Fly to New York");
                commands.Add("Fly to london");
                commands.Add("Fly to New Delhi");
                commands.Add("fly to Mumbai");
                commands.Add("street");
                commands.Add("street view");
                commands.Add("Map view");
                commands.Add("fy to Chicago");
                commands.Add("fly to Los Angeles");
                commands.Add("Hello");
                commands.Add("baby");
                commands.Add("fly to San francisco");
                commands.Add("stop");

                var gb = new GrammarBuilder { Culture = ri.Culture };

                // Specify the culture to match the recognizer in case we are running in a different culture.                                 
                gb.Append(commands);

                // Create the actual Grammar instance, and then load it into the speech recognizer.
                var g = new Grammar(gb);

                sre.LoadGrammar(g);
                sre.SpeechRecognized += SreSpeechRecognized;
                sre.SpeechHypothesized += SreSpeechHypothesized;
                sre.SpeechRecognitionRejected += SreSpeechRecognitionRejected;

                using (Stream s = source.Start())
                {
                    sre.SetInputToAudioStream(
                        s, new SpeechAudioFormatInfo(EncodingFormat.Pcm, 16000, 16, 1, 32000, 2, null));

                   // Console.WriteLine("Recognizing speech. Say something baby :P. Press ENTER to stop");

                    sre.RecognizeAsync(RecognizeMode.Multiple);
                    Console.ReadLine();
                   // Console.WriteLine("Stopping recognizer ...");
                    sre.RecognizeAsyncStop();
                }
            }

            sensor.Stop();

        }

        private static RecognizerInfo GetKinectRecognizer()
        {
            Func<RecognizerInfo, bool> matchingFunc = r =>
            {
                string value;
                r.AdditionalInfo.TryGetValue("Kinect", out value);
                return "True".Equals(value, StringComparison.InvariantCultureIgnoreCase) && "en-US".Equals(r.Culture.Name, StringComparison.InvariantCultureIgnoreCase);
            };
            return SpeechRecognitionEngine.InstalledRecognizers().Where(matchingFunc).FirstOrDefault();
        }

        private static void SreSpeechRecognitionRejected(object sender, SpeechRecognitionRejectedEventArgs e)
        {
            /*Console.WriteLine("\nSpeech Rejected");
            if (e.Result != null)
            {
                Console.WriteLine("Incorrect Entry");

            }*/
        }

        private static void SreSpeechHypothesized(object sender, SpeechHypothesizedEventArgs e)
        {
           // Console.Write("\rSpeech Hypothesized: \t{0}", e.Result.Text);
        }

        private static void SreSpeechRecognized(object sender, SpeechRecognizedEventArgs e)
        {

            
            if (e.Result.Confidence >= 0.7)
            {
               //Console.WriteLine("\nSpeech Recognized: \t{0}\tConfidence:\t{1}", e.Result.Text, e.Result.Confidence);
                Console.WriteLine(e.Result.Text);
            }
            else
            {
               // Console.WriteLine("\nSpeech Recognized but confidence was too low: \t{0}", e.Result.Confidence);
               // Console.WriteLine("Please try Again");

            }
        }
        private static void InitializeServer()
        {
            var aServer = new WebSocketServer(8181, System.Net.IPAddress.Any)
            {
                OnReceive = OnReceive,
                OnSend = OnSend,
                OnConnected = OnConnect,
                OnDisconnect = OnDisconnect,
                //TimeOut = new TimeSpan(0, 5, 0)
            };
            aServer.Start();
            _serverInitialized = true;

            Console.ReadLine();
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.Title = "MotionMaps WebSocket Server";
            Console.WriteLine("Running WebSocket Server ...");
        }

        public static void OnConnect(UserContext aContext)
        {

            Console.WriteLine("Client Connected From : " + aContext.ClientAddress.ToString());

            // Create a new Connection Object to save client context information
           // var conn = new Connection { Context = aContext };

            // Add a connection Object to thread-safe collection
            /*for (int i = 0; i < 100; i++)
            */
            {
                aContext.Send("");
            }/* */
             
            OnlineConnections.TryAdd(aContext.ClientAddress.ToString(), aContext);
            //connecter = aContext;
        }



        public static void OnReceive(UserContext aContext)
        {
            try
            {
                Console.WriteLine("Data Received From [" + aContext.ClientAddress.ToString() + "] - " + aContext.DataFrame.ToString());
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
            }

        }
        public static void OnSend(UserContext aContext)
        {
            Console.WriteLine("Data Sent To : " + aContext.ClientAddress.ToString());
        }
        public static void OnDisconnect(UserContext aContext)
        {
            Console.WriteLine("Client Disconnected : " + aContext.ClientAddress.ToString());
            //OnlineConnections.TryRemove(aContext.ClientAddress.ToString(), out conn);

        }

        public class Connection
        {
            public System.Threading.Timer timer;
            public UserContext Context { get; set; }
            public Connection()
            {
                //this.timer = new System.Threading.Timer(this.TimerCallback, null, 0, 1000);
                Context.Send("[" + Context.ClientAddress.ToString() + "] " + System.DateTime.Now.ToString());
            }

            public void SendMessage(string json)
            {
                Context.Send(json);
            }

        }



        private static void InitilizeKinect()
        {
            var sensor = KinectSensor.KinectSensors.SingleOrDefault();

            if (sensor != null)
            {
                sensor.SkeletonStream.Enable();
                sensor.SkeletonFrameReady += Sensor_SkeletonFrameReady;

                sensor.Start();
            }
        }

        static void processSkeletonFrame(Skeleton skeleton)
        {
            // Get Skeleton Data
            Joint head = skeleton.Joints[JointType.Head];
            Joint rightShoulder = skeleton.Joints[JointType.ShoulderRight];
            Joint leftShoulder = skeleton.Joints[JointType.ShoulderLeft];
            Joint rightHand = skeleton.Joints[JointType.HandRight];
            Joint rightElbow = skeleton.Joints[JointType.ElbowRight];
            Joint leftHand = skeleton.Joints[JointType.HandLeft];
            Joint leftElbow = skeleton.Joints[JointType.ElbowLeft];
            Joint rightFoot = skeleton.Joints[JointType.FootRight];
            Joint leftFoot = skeleton.Joints[JointType.FootLeft];
            Joint centerShoulder = skeleton.Joints[JointType.ShoulderCenter];

            // Detect gestures
            detectWalking(rightFoot, leftFoot);
            detectShoulderTurning(rightShoulder, leftShoulder);
            detectArmMovement(rightHand, rightShoulder);
            detectBothHandsUp(rightHand, leftHand, head);
        }

        private static void detectBothHandsUp(Joint rightHand, Joint leftHand, Joint head)
        {
            double rightHandHeightDiffY = rightHand.Position.Y - head.Position.Y;

            if (rightHandHeightDiffY > stopThreshold)
            {
                //STOP ALL MOTION
                foreach (KeyValuePair<string, UserContext> item in OnlineConnections)
                {
                    item.Value.Send("{\"event\":\"stop\"}");
                }
                Console.WriteLine("STOP ALL MOTION BHENCHOD!");
            }
        }

        private static void detectArmMovement(Joint rightHand, Joint rightShoulder)
        {
            double armDepthDifferential = rightHand.Position.Z - rightShoulder.Position.Z;

            if (armDepthDifferential > tiltSlowThresh)
            {
                //LOOK DOWN
                foreach (KeyValuePair<string, UserContext> item in OnlineConnections)
                {
                    item.Value.Send("{\"event\":\"altitude\",\"direction\":\"down\"}");
                }
                Console.WriteLine("LOOK DOWN!");
            }
            else if (armDepthDifferential < -tiltSlowThresh)
            {
                foreach (KeyValuePair<string, UserContext> item in OnlineConnections)
                {
                    item.Value.Send("{\"event\":\"altitude\",\"direction\":\"up\"}");
                }
                Console.WriteLine("LOOK UP!");
            }
            else
            {
                Console.WriteLine("STOP!");
            }
        }

        private static void detectShoulderTurning(Joint rightShoulder, Joint leftShoulder)
        {
            double shoulderDepthDifferential = leftShoulder.Position.Z - rightShoulder.Position.Z;

            if (shoulderDepthDifferential > turnSlowThresh)
            {
                //TURN LEFT
                foreach (KeyValuePair<string, UserContext> item in OnlineConnections)
                {
                    item.Value.Send("{\"event\":\"turn\",\"direction\":\"left\"}");
                }
                Console.WriteLine("LEFT!");
            }
            else if (shoulderDepthDifferential < -turnSlowThresh)
            {
                //TURN RIGHT
                foreach (KeyValuePair<string, UserContext> item in OnlineConnections)
                {
                    item.Value.Send("{\"event\":\"turn\",\"direction\":\"right\"}");
                }
                Console.WriteLine("RIGHT!");
            }
            else
            {
                Console.WriteLine("STOP!");
            }
        }

        private static void detectWalking(Joint rightFoot, Joint leftFoot)
        {

            double feetDifferential = leftFoot.Position.Z - rightFoot.Position.Z;

            // Move backward
            if (feetDifferential > walkThresh)
            {
                foreach (KeyValuePair<string, UserContext> item in OnlineConnections)
                {
                    item.Value.Send("{\"event\":\"decelerate\",\"multiplier\":\"" + feetDifferential + "\"}");
                }
                Console.WriteLine("BACK!");
            }
            // Move forward
            else if (feetDifferential < -walkThresh)
            {
                foreach (KeyValuePair<string, UserContext> item in OnlineConnections)
                {
                    item.Value.Send("{\"event\":\"accelerate\",\"multiplier\":\"" + (-feetDifferential) + "\"}");
                }
                Console.WriteLine("FORWARD!");
            }
            else
            {
                Console.WriteLine("STOP!");
            }
        }

        static void Sensor_SkeletonFrameReady(object sender, SkeletonFrameReadyEventArgs e)
        {
            if (!_serverInitialized) return;

            List<Skeleton> users = new List<Skeleton>();

            using (var frame = e.OpenSkeletonFrame())
            {
                if (frame != null)
                {
                    frame.CopySkeletonDataTo(_skeletons);

                    foreach (var skeleton in _skeletons)
                    {
                        if (skeleton.TrackingState == SkeletonTrackingState.Tracked)
                        {
                            users.Add(skeleton);
                        }
                    }

                    if (users.Count > 0)
                    {
                        Console.WriteLine("1");
                        string json = users.Serialize();

                        foreach (var skeleton in users)
                        {
                            processSkeletonFrame(skeleton);
                        }

                        //foreach (KeyValuePair<string, UserContext> item in OnlineConnections)
                        //{
                        //    item.Value.Send(json);
                        //}
                    }
                }
            }
        }
    }
}

