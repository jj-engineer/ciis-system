using System;
using System.Drawing;
using System.Windows.Forms;
using SchoolPcAgent.Config;
using SchoolPcAgent.Services;

namespace SchoolPcAgent.UI
{
    public class TrayApplicationContext : ApplicationContext
    {
        private readonly NotifyIcon _trayIcon;
        private readonly AgentConfig _config;
        private readonly WebSocketClient _wsClient;

        public TrayApplicationContext(AgentConfig config, WebSocketClient wsClient)
        {
            _config = config;
            _wsClient = wsClient;

            _wsClient.ConnectionStatusChanged += OnConnectionStatusChanged;

            var contextMenu = new ContextMenuStrip();
            contextMenu.Items.Add($"💻 Computer: {_config.ComputerNumber}", null, null);
            contextMenu.Items.Add($"Status: 🟢 Connected", null, null);
            contextMenu.Items.Add($"Version: {_config.AgentVersion}", null, null);
            contextMenu.Items.Add(new ToolStripSeparator());
            contextMenu.Items.Add("Exit Agent", null, OnExitClicked);

            _trayIcon = new NotifyIcon
            {
                Icon = SystemIcons.Application,
                ContextMenuStrip = contextMenu,
                Visible = true,
                Text = $"School PC Agent ({_config.ComputerNumber}) - Connected"
            };
        }

        private void OnConnectionStatusChanged(bool isConnected)
        {
            if (_trayIcon.ContextMenuStrip?.Items.Count > 1)
            {
                _trayIcon.ContextMenuStrip.Items[1].Text = isConnected ? "Status: 🟢 Connected" : "Status: 🔴 Offline (Reconnecting)";
                _trayIcon.Text = $"School PC Agent ({_config.ComputerNumber}) - {(isConnected ? "Connected" : "Disconnected")}";
            }
        }

        private void OnExitClicked(object? sender, EventArgs e)
        {
            _trayIcon.Visible = false;
            _trayIcon.Dispose();
            Application.Exit();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _trayIcon.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
