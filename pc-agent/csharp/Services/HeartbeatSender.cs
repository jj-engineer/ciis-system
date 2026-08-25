using System;
using System.Threading;
using System.Threading.Tasks;
using SchoolPcAgent.Config;

namespace SchoolPcAgent.Services
{
    public class HeartbeatSender : IDisposable
    {
        private readonly WebSocketClient _wsClient;
        private readonly AgentConfig _config;
        private CancellationTokenSource? _cts;
        private bool _isDisposed;

        public HeartbeatSender(WebSocketClient wsClient, AgentConfig config)
        {
            _wsClient = wsClient;
            _config = config;
        }

        public void Start(CancellationToken ct)
        {
            _cts = CancellationTokenSource.CreateLinkedTokenSource(ct);

            _ = Task.Run(async () =>
            {
                while (!_cts.Token.IsCancellationRequested)
                {
                    if (_wsClient.IsConnected)
                    {
                        var heartbeat = new
                        {
                            type = "heartbeat",
                            computerNumber = _config.ComputerNumber,
                            timestamp = DateTime.UtcNow.ToString("o")
                        };

                        try
                        {
                            await _wsClient.SendJsonAsync(heartbeat, _cts.Token);
                            Console.WriteLine($"[Heartbeat Sent] 💻 Computer {_config.ComputerNumber} at {DateTime.Now:HH:mm:ss}");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"[Heartbeat Error] {ex.Message}");
                        }
                    }

                    await Task.Delay(TimeSpan.FromSeconds(_config.HeartbeatIntervalSeconds), _cts.Token);
                }
            }, _cts.Token);
        }

        public void Dispose()
        {
            if (_isDisposed) return;
            _isDisposed = true;
            _cts?.Cancel();
            _cts?.Dispose();
        }
    }
}
