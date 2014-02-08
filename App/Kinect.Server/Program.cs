using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Kinect;
using Alchemy;
using Alchemy.Classes;
using System.Collections.Concurrent;
using System.Threading;

namespace Kinect.Server
{
    class Program
    {
        //static List<IWebSocketConnection> _clients = new List<IWebSocketConnection>();
        protected static ConcurrentDictionary<string,UserContext> OnlineConnections ;
        static UserContext connecter = null;
        static bool _serverInitialized = false;

        static Skeleton[] _skeletons = new Skeleton[6];

        static void Main(string[] args)
        {
            InitilizeKinect();
            InitializeServer();
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
                        string json = users.Serialize();
                        foreach (KeyValuePair<string, UserContext> item in OnlineConnections)
                        {
                            item.Value.Send(json);
                        }
                        

                    }
                }
            }
        }
    }
}
