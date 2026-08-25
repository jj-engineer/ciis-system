using System.Text.Json.Serialization;

namespace SchoolPcAgent.Config
{
    public class AgentConfig
    {
        [JsonPropertyName("serverUrl")]
        public string ServerUrl { get; set; } = "ws://localhost:4001/ws/agent";

        [JsonPropertyName("computerNumber")]
        public string ComputerNumber { get; set; } = "01";

        [JsonPropertyName("agentToken")]
        public string AgentToken { get; set; } = "token-01-auth";

        [JsonPropertyName("agentVersion")]
        public string AgentVersion { get; set; } = "0.1.0";

        [JsonPropertyName("heartbeatIntervalSeconds")]
        public int HeartbeatIntervalSeconds { get; set; } = 5;

        [JsonPropertyName("autoStartWithWindows")]
        public bool AutoStartWithWindows { get; set; } = true;
    }
}
