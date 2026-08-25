using System;
using System.IO;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Win32;
using SchoolPcAgent.Config;
using SchoolPcAgent.Services;
using SchoolPcAgent.UI;

namespace SchoolPcAgent
{
    internal static class Program
    {
        [STAThread]
        private static async Task Main(string[] args)
        {
            ApplicationConfiguration.Initialize();

            // Load Local Configuration
            var config = LoadConfig();

            Console.WriteLine("=========================================================");
            Console.WriteLine($"  CIIS SCHOOL PC AGENT MVP (v{config.AgentVersion})");
            Console.WriteLine("=========================================================");
            Console.WriteLine($"  * Computer Number: {config.ComputerNumber}");
            Console.WriteLine($"  * Server URL:      {config.ServerUrl}");
            Console.WriteLine($"  * Mode:            Background Online/Offline Monitor");
            Console.WriteLine("=========================================================");

            // Configure Windows Startup if enabled
            if (config.AutoStartWithWindows)
            {
                ConfigureWindowsStartup(true);
            }

            var cts = new CancellationTokenSource();

            using var wsClient = new WebSocketClient(config);
            using var heartbeatSender = new HeartbeatSender(wsClient, config);

            // Start WebSocket Client & Heartbeat Engine
            await wsClient.StartAsync(cts.Token);
            heartbeatSender.Start(cts.Token);

            // Run Quietly in Background System Tray
            var trayContext = new TrayApplicationContext(config, wsClient);
            Application.Run(trayContext);

            cts.Cancel();
        }

        private static AgentConfig LoadConfig()
        {
            var configPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Config", "appsettings.json");
            if (File.Exists(configPath))
            {
                try
                {
                    var json = File.ReadAllText(configPath);
                    return JsonSerializer.Deserialize<AgentConfig>(json) ?? new AgentConfig();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to parse appsettings.json: {ex.Message}");
                }
            }
            return new AgentConfig();
        }

        private static void ConfigureWindowsStartup(bool enable)
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Run", true);
                if (key != null)
                {
                    var appPath = Application.ExecutablePath;
                    if (enable)
                    {
                        key.SetValue("CIISSchoolPcAgent", $"\"{appPath}\"");
                    }
                    else
                    {
                        key.DeleteValue("CIISSchoolPcAgent", false);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Could not update Windows Startup registry: {ex.Message}");
            }
        }
    }
}
