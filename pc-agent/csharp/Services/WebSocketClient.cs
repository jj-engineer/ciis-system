using System;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using SchoolPcAgent.Config;

namespace SchoolPcAgent.Services
{
    public class WebSocketClient : IDisposable
    {
        private readonly AgentConfig _config;
        private ClientWebSocket? _webSocket;
        private CancellationTokenSource? _cts;
        private bool _isDisposed;
        private int _reconnectDelaySeconds = 1;
        private const int MaxReconnectDelaySeconds = 30;

        public event Action<bool>? ConnectionStatusChanged;
        public event Action<string>? MessageReceived;

        public bool IsConnected => _webSocket?.State == WebSocketState.Open;

        public WebSocketClient(AgentConfig config)
        {
            _config = config;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);

            _ = Task.Run(async () =>
            {
                while (!_cts.Token.IsCancellationRequested)
                {
                    try
                    {
                        await ConnectAndRunAsync(_cts.Token);
                    }
                    catch (Exception ex) when (!_cts.Token.IsCancellationRequested)
                    {
                        Console.WriteLine($"[Connection Error] {ex.Message}");
                    }

                    if (!_cts.Token.IsCancellationRequested)
                    {
                        ConnectionStatusChanged?.Invoke(false);
                        Console.WriteLine($"[Reconnecting in {_reconnectDelaySeconds}s...]");
                        await Task.Delay(TimeSpan.FromSeconds(_reconnectDelaySeconds), _cts.Token);

                        // Exponential backoff up to 30s
                        _reconnectDelaySeconds = Math.Min(_reconnectDelaySeconds * 2, MaxReconnectDelaySeconds);
                    }
                }
            }, _cts.Token);
        }

        private async Task ConnectAndRunAsync(CancellationToken ct)
        {
            _webSocket?.Dispose();
            _webSocket = new ClientWebSocket();

            Console.WriteLine($"[Connecting] {_config.ServerUrl} (Computer {_config.ComputerNumber})...");
            await _webSocket.ConnectAsync(new Uri(_config.ServerUrl), ct);

            // Reset backoff upon successful connection
            _reconnectDelaySeconds = 1;
            Console.WriteLine($"[Connected] Authenticating as Computer {_config.ComputerNumber}...");

            // Send Authentication Handshake
            var authPayload = new
            {
                type = "auth",
                computerNumber = _config.ComputerNumber,
                agentToken = _config.AgentToken,
                hostname = Environment.MachineName,
                agentVersion = _config.AgentVersion
            };

            await SendJsonAsync(authPayload, ct);
            ConnectionStatusChanged?.Invoke(true);

            // Listen for incoming messages (Heartbeat ACKs)
            var buffer = new byte[4096];
            while (_webSocket.State == WebSocketState.Open && !ct.IsCancellationRequested)
            {
                var result = await _webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), ct);
                if (result.MessageType == WebSocketMessageType.Close)
                {
                    Console.WriteLine("[Server Closed Connection]");
                    break;
                }

                var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                MessageReceived?.Invoke(message);
            }
        }

        public async Task SendJsonAsync(object payload, CancellationToken ct = default)
        {
            if (_webSocket?.State != WebSocketState.Open) return;

            var json = JsonSerializer.Serialize(payload);
            var bytes = Encoding.UTF8.GetBytes(json);
            await _webSocket.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, true, ct);
        }

        public void Dispose()
        {
            if (_isDisposed) return;
            _isDisposed = true;
            _cts?.Cancel();
            _webSocket?.Dispose();
            _cts?.Dispose();
        }
    }
}
