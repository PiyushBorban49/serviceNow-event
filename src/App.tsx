import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  Copy, 
  Check, 
  RefreshCw, 
  Database, 
  Layers, 
  Code2, 
  GitBranch, 
  ExternalLink, 
  Cpu, 
  HardDrive, 
  Server, 
  ShieldAlert,
  Flame,
  ArrowRight
} from 'lucide-react';

interface ServiceNowEvent {
  id: string;
  source: string;
  node: string;
  type: string;
  resource: string;
  severity: number; // 1: Critical, 2: Major, 3: Minor, 4: Warning, 5: Info, 0: Clear
  metric_name: string;
  metric_value?: string;
  description: string;
  message_key: string;
  additional_info: string;
  time_of_event: string;
  status: 'Ready' | 'Processed' | 'Alert Created';
  alert_id?: string;
  incident_id?: string;
}

const SEVERITY_CONFIG: Record<number, { label: string; color: string; badge: string; icon: React.ReactNode }> = {
  1: { 
    label: '1 - Critical', 
    color: 'text-red-400', 
    badge: 'bg-red-500/10 text-red-400 border-red-500/30',
    icon: <AlertOctagon className="w-4 h-4 text-red-400" />
  },
  2: { 
    label: '2 - Major', 
    color: 'text-orange-400', 
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    icon: <Flame className="w-4 h-4 text-orange-400" />
  },
  3: { 
    label: '3 - Minor', 
    color: 'text-amber-400', 
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    icon: <AlertTriangle className="w-4 h-4 text-amber-400" />
  },
  4: { 
    label: '4 - Warning', 
    color: 'text-yellow-400', 
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    icon: <AlertTriangle className="w-4 h-4 text-yellow-400" />
  },
  5: { 
    label: '5 - Info', 
    color: 'text-blue-400', 
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    icon: <Info className="w-4 h-4 text-blue-400" />
  },
  0: { 
    label: '0 - Clear', 
    color: 'text-emerald-400', 
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />
  }
};

const TEMPLATES = [
  {
    name: 'High CPU on Production DB',
    icon: Cpu,
    source: 'Datadog',
    node: 'db-prod-cluster-01.corp.internal',
    type: 'HighCPUUtilization',
    resource: 'CPU-Core-All',
    severity: 1,
    metric_name: 'system.cpu.idle',
    metric_value: '2.4%',
    description: 'CPU idle capacity below 5% for >10 mins on active primary PostgreSQL node.',
    additional_info: JSON.stringify({ cluster: 'db-prod', region: 'us-east-1', hypervisor: 'aws-ec2' }, null, 2)
  },
  {
    name: 'Disk Space Running Out',
    icon: HardDrive,
    source: 'SolarWinds',
    node: 'storage-san-tier1.datacenter.corp',
    type: 'DiskVolumeThreshold',
    resource: '/dev/vg_data/lv_appdata',
    severity: 2,
    metric_name: 'disk.used_percent',
    metric_value: '94.8%',
    description: 'Data partition usage exceeds 90% threshold. Immediate cleanup or expansion required.',
    additional_info: JSON.stringify({ mount_point: '/var/lib/docker', total_gb: 2048, free_gb: 106 }, null, 2)
  },
  {
    name: 'Kubernetes Pod CrashLoopBackOff',
    icon: Server,
    source: 'Prometheus',
    node: 'k8s-worker-node-42',
    type: 'ContainerCrashLoop',
    resource: 'payment-checkout-api-7b89f5c4f-8x9pz',
    severity: 1,
    metric_name: 'kube_pod_container_status_restarts_total',
    metric_value: '18',
    description: 'Service pod payment-checkout-api continuously crashing due to OOMKilled signal 137.',
    additional_info: JSON.stringify({ namespace: 'ecommerce', replica_set: 'payment-checkout-api-7b89f5c4f' }, null, 2)
  },
  {
    name: 'SSL Expiry Warning',
    icon: ShieldAlert,
    source: 'Dynatrace',
    node: 'api.acme-corp.com',
    type: 'SSLCertExpiry',
    resource: 'port-443-tls',
    severity: 4,
    metric_name: 'ssl_certificate_days_remaining',
    metric_value: '6',
    description: 'Inbound TLS wildcard certificate will expire in less than 7 calendar days.',
    additional_info: JSON.stringify({ issuer: "Let's Encrypt", expires_on: '2026-10-07' }, null, 2)
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'workbench' | 'pipeline' | 'api' | 'github'>('workbench');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Form state
  const [source, setSource] = useState('Datadog');
  const [node, setNode] = useState('db-prod-cluster-01.corp.internal');
  const [type, setType] = useState('HighCPUUtilization');
  const [resource, setResource] = useState('CPU-Core-All');
  const [severity, setSeverity] = useState<number>(1);
  const [metricName, setMetricName] = useState('system.cpu.idle');
  const [metricValue, setMetricValue] = useState('2.4%');
  const [description, setDescription] = useState('CPU idle capacity below 5% for >10 mins on active primary PostgreSQL node.');
  const [additionalInfo, setAdditionalInfo] = useState(
    JSON.stringify({ cluster: 'db-prod', region: 'us-east-1', hypervisor: 'aws-ec2' }, null, 2)
  );

  // Instance config for mock/preview
  const [instanceUrl, setInstanceUrl] = useState('https://dev12345.service-now.com');
  const [apiFormat, setApiFormat] = useState<'table_api' | 'itom_jsonv2'>('table_api');

  // History events
  const [events, setEvents] = useState<ServiceNowEvent[]>([
    {
      id: 'EVT0049201',
      source: 'Datadog',
      node: 'db-prod-cluster-01.corp.internal',
      type: 'HighCPUUtilization',
      resource: 'CPU-Core-All',
      severity: 1,
      metric_name: 'system.cpu.idle',
      metric_value: '2.4%',
      description: 'CPU idle capacity below 5% for >10 mins on active primary PostgreSQL node.',
      message_key: 'Datadog_db-prod-cluster-01.corp.internal_HighCPUUtilization_CPU-Core-All',
      additional_info: '{"cluster":"db-prod","region":"us-east-1"}',
      time_of_event: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString(),
      status: 'Alert Created',
      alert_id: 'ALT0018402',
      incident_id: 'INC0094821'
    },
    {
      id: 'EVT0049198',
      source: 'SolarWinds',
      node: 'storage-san-tier1.datacenter.corp',
      type: 'DiskVolumeThreshold',
      resource: '/dev/vg_data/lv_appdata',
      severity: 2,
      metric_name: 'disk.used_percent',
      metric_value: '94.8%',
      description: 'Data partition usage exceeds 90% threshold. Immediate cleanup or expansion required.',
      message_key: 'SolarWinds_storage-san-tier1.datacenter.corp_DiskVolumeThreshold',
      additional_info: '{"total_gb":2048,"free_gb":106}',
      time_of_event: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString(),
      status: 'Alert Created',
      alert_id: 'ALT0018399',
      incident_id: 'INC0094819'
    },
    {
      id: 'EVT0049182',
      source: 'Dynatrace',
      node: 'api.acme-corp.com',
      type: 'SSLCertExpiry',
      resource: 'port-443-tls',
      severity: 4,
      metric_name: 'ssl_certificate_days_remaining',
      metric_value: '6',
      description: 'Inbound TLS wildcard certificate will expire in less than 7 calendar days.',
      message_key: 'Dynatrace_api.acme-corp.com_SSLCertExpiry',
      additional_info: '{"expires_on":"2026-10-07"}',
      time_of_event: new Date(Date.now() - 1000 * 60 * 180).toLocaleTimeString(),
      status: 'Processed'
    }
  ]);

  const loadTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setSource(tmpl.source);
    setNode(tmpl.node);
    setType(tmpl.type);
    setResource(tmpl.resource);
    setSeverity(tmpl.severity);
    setMetricName(tmpl.metric_name);
    setMetricValue(tmpl.metric_value);
    setDescription(tmpl.description);
    setAdditionalInfo(tmpl.additional_info);
  };

  const handleSendEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const eventId = `EVT0049${Math.floor(200 + Math.random() * 800)}`;
    const msgKey = `${source}_${node}_${type}_${resource || 'default'}`;
    const willCreateAlert = severity === 1 || severity === 2;
    const alertId = willCreateAlert ? `ALT0018${Math.floor(400 + Math.random() * 500)}` : undefined;
    const incId = severity === 1 ? `INC0094${Math.floor(820 + Math.random() * 150)}` : undefined;

    const newEvent: ServiceNowEvent = {
      id: eventId,
      source,
      node,
      type,
      resource,
      severity,
      metric_name: metricName,
      metric_value: metricValue,
      description,
      message_key: msgKey,
      additional_info: additionalInfo,
      time_of_event: new Date().toLocaleTimeString(),
      status: willCreateAlert ? 'Alert Created' : 'Processed',
      alert_id: alertId,
      incident_id: incId
    };

    setEvents([newEvent, ...events]);
  };

  // Generate payload JSON
  const currentPayload = apiFormat === 'table_api' 
    ? {
        source,
        node,
        type,
        resource,
        severity: severity.toString(),
        metric_name: metricName,
        metric_value: metricValue,
        description,
        message_key: `${source}_${node}_${type}_${resource || 'default'}`,
        additional_info: additionalInfo.startsWith('{') ? additionalInfo : JSON.stringify({ raw: additionalInfo }),
        time_of_event: new Date().toISOString()
      }
    : {
        records: [
          {
            source,
            node,
            type,
            resource,
            severity,
            metric_name: metricName,
            description,
            additional_info: additionalInfo,
            time_of_event: new Date().toISOString()
          }
        ]
      };

  const curlSnippet = `curl -X POST "${instanceUrl}${apiFormat === 'table_api' ? '/api/now/table/em_event' : '/api/global/em/jsonv2'}" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json" \\
  -u "admin:YOUR_PASSWORD_OR_TOKEN" \\
  -d '${JSON.stringify(currentPayload, null, 2)}'`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg text-white tracking-tight">serviceNow-event</h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ITOM Event Management
                </span>
              </div>
              <p className="text-xs text-slate-400">Event Ingestion, em_event Table & Alert Pipeline</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs font-medium">
            <button
              onClick={() => setActiveTab('workbench')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
                activeTab === 'workbench'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Workbench</span>
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
                activeTab === 'pipeline'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Event Pipeline</span>
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
                activeTab === 'api'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>REST & cURL</span>
            </button>
            <button
              onClick={() => setActiveTab('github')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
                activeTab === 'github'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: WORKBENCH */}
        {activeTab === 'workbench' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Quick Templates & Ingestion Form */}
            <div className="lg:col-span-6 space-y-6">
              {/* Presets */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-emerald-400" />
                    <span>Quick Event Templates</span>
                  </h3>
                  <span className="text-xs text-slate-400">Click to fill</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATES.map((tmpl) => {
                    const Icon = tmpl.icon;
                    return (
                      <button
                        key={tmpl.name}
                        onClick={() => loadTemplate(tmpl)}
                        className="text-left p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 hover:border-slate-700 transition flex items-start space-x-2.5 group"
                      >
                        <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 text-slate-400 transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-slate-200 truncate group-hover:text-emerald-300">
                            {tmpl.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {tmpl.source} • Sev {tmpl.severity}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Event Form */}
              <form onSubmit={handleSendEvent} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Event Payload Builder</h3>
                    <p className="text-xs text-slate-400">Writes directly into ServiceNow <code className="text-emerald-400">em_event</code></p>
                  </div>
                  <span className="text-xs font-mono text-slate-500">POST /api/now/table/em_event</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Source (Monitoring Tool)</label>
                    <input
                      type="text"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      required
                      placeholder="e.g. Datadog, SolarWinds, CloudWatch"
                      className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Node (CI / Host / IP)</label>
                    <input
                      type="text"
                      value={node}
                      onChange={(e) => setNode(e.target.value)}
                      required
                      placeholder="e.g. srv-app-01.corp"
                      className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Type (Event / Metric Type)</label>
                    <input
                      type="text"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      required
                      placeholder="e.g. HighCPUUtilization, DiskFull"
                      className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Resource (Sub-component)</label>
                    <input
                      type="text"
                      value={resource}
                      onChange={(e) => setResource(e.target.value)}
                      placeholder="e.g. /var/log, eth0, CPU-0"
                      className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Severity</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(Number(e.target.value))}
                      className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value={1}>1 - Critical (Creates P1 Incident)</option>
                      <option value={2}>2 - Major (Creates Alert)</option>
                      <option value={3}>3 - Minor</option>
                      <option value={4}>4 - Warning</option>
                      <option value={5}>5 - Information</option>
                      <option value={0}>0 - Clear (Auto-closes Alert)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Metric Value</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={metricName}
                        onChange={(e) => setMetricName(e.target.value)}
                        placeholder="Name (e.g. cpu.load)"
                        className="w-1/2 text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                      <input
                        type="text"
                        value={metricValue}
                        onChange={(e) => setMetricValue(e.target.value)}
                        placeholder="Value (e.g. 98.4%)"
                        className="w-1/2 text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Short description of the event condition..."
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Additional Info (JSON payload)
                  </label>
                  <textarea
                    rows={3}
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder='{"tags": ["prod", "us-east"]}'
                    className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-600/20 active:scale-[0.99]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Emit Event to ServiceNow Pipeline</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Real-time Ingestion Stream & Alert Grouping */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col h-full">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span>Live Event Log & Alert Correlation</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Recent records in <code className="text-emerald-400">em_event</code> table
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs text-emerald-400 font-medium">Listening</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {events.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      No events sent yet. Fill the form or pick a template to trigger an event.
                    </div>
                  ) : (
                    events.map((evt) => {
                      const sev = SEVERITY_CONFIG[evt.severity] || SEVERITY_CONFIG[5];
                      return (
                        <div
                          key={evt.id}
                          className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5 hover:border-slate-700 transition"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-xs font-bold text-white">{evt.id}</span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${sev.badge} flex items-center space-x-1`}>
                                {sev.icon}
                                <span>{sev.label}</span>
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">{evt.time_of_event}</span>
                          </div>

                          <div className="text-xs text-slate-200">
                            <span className="font-semibold text-white">{evt.type}</span> on <span className="font-mono text-emerald-300">{evt.node}</span>
                            {evt.resource && <span className="text-slate-400"> ({evt.resource})</span>}
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed">
                            {evt.description}
                          </p>

                          {/* Message Key and Alert links */}
                          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                            <div className="text-slate-400">
                              Source: <span className="text-slate-200 font-medium">{evt.source}</span>
                              {evt.metric_value && (
                                <span className="ml-2 font-mono text-amber-300">[{evt.metric_name}: {evt.metric_value}]</span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                              {evt.alert_id && (
                                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-mono">
                                  {evt.alert_id}
                                </span>
                              )}
                              {evt.incident_id && (
                                <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/30 text-[10px] font-mono">
                                  {evt.incident_id}
                                </span>
                              )}
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                                {evt.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PIPELINE EXPLAINER */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-white mb-2">ServiceNow ITOM Event Processing Architecture</h2>
              <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
                ServiceNow Event Management connects external monitoring tools with CMDB Configuration Items (CIs).
                Raw monitoring alerts flow through normalization, deduplication, alert correlation, and automated incident creation.
              </p>

              {/* Step diagram */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 relative">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20">
                    1
                  </div>
                  <h4 className="text-sm font-semibold text-white">Event Ingestion</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Events enter through REST API (<code className="text-emerald-400">em_event</code>), SNMP traps, Mid Server push, or connectors.
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 pt-2">Table: em_event</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 relative">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/20">
                    2
                  </div>
                  <h4 className="text-sm font-semibold text-white">Event Rules & Filtering</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Transforms raw strings, binds to CMDB CI based on IP/FQDN/MAC, and calculates severity thresholds.
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 pt-2">Rule: em_event_rule</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 relative">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm border border-purple-500/20">
                    3
                  </div>
                  <h4 className="text-sm font-semibold text-white">Deduplication & Alerts</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Groups events matching <code className="text-purple-400">message_key</code>. Creates or updates a single actionable alert.
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 pt-2">Table: em_alert</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 relative">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-sm border border-red-500/20">
                    4
                  </div>
                  <h4 className="text-sm font-semibold text-white">Alert Management Rule</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Auto-opens Incidents (<code className="text-red-400">incident</code>), executes remediation workflows or subflows in Flow Designer.
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 pt-2">Table: incident</div>
                </div>
              </div>
            </div>

            {/* Severity Matrix */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-white mb-4">ServiceNow Standard Severity Scale</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {Object.entries(SEVERITY_CONFIG).map(([sevNum, cfg]) => (
                  <div key={sevNum} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center space-y-1">
                    <div className="flex justify-center">{cfg.icon}</div>
                    <div className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</div>
                    <div className="text-[10px] text-slate-400">
                      {Number(sevNum) === 0 ? 'Closes active alert' : Number(sevNum) === 1 ? 'High priority incident' : 'Alert monitoring'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REST & CURL */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-semibold text-white">ServiceNow Event REST APIs</h3>
                  <p className="text-xs text-slate-400">Ready-to-use curl and script commands for testing external webhooks</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setApiFormat('table_api')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      apiFormat === 'table_api'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Table API (/em_event)
                  </button>
                  <button
                    onClick={() => setApiFormat('itom_jsonv2')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      apiFormat === 'itom_jsonv2'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ITOM Multi-Insert (/jsonv2)
                  </button>
                </div>
              </div>

              {/* Instance URL */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target ServiceNow Instance URL</label>
                <input
                  type="text"
                  value={instanceUrl}
                  onChange={(e) => setInstanceUrl(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Code Snippet */}
              <div className="relative">
                <div className="flex items-center justify-between bg-slate-950 px-4 py-2 border-t border-x border-slate-800 rounded-t-xl">
                  <span className="text-xs font-mono text-slate-400">cURL Command</span>
                  <button
                    onClick={() => copyToClipboard(curlSnippet)}
                    className="flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? 'Copied!' : 'Copy cURL'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800 rounded-b-xl p-4 text-xs font-mono text-emerald-300 overflow-x-auto">
                  {curlSnippet}
                </pre>
              </div>

              {/* JSON preview */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-slate-300 mb-2">Payload JSON Body Preview</h4>
                <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto">
                  {JSON.stringify(currentPayload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GITHUB REPO */}
        {activeTab === 'github' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200">
                    <GitBranch className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">GitHub Project Synchronization</h3>
                    <p className="text-xs text-slate-400">Repository connected to GitHub origin</p>
                  </div>
                </div>

                <a
                  href="https://github.com/PiyushBorban49/serviceNow-event"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium flex items-center space-x-1.5 hover:bg-emerald-600/30 transition"
                >
                  <span>Open on GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Remote Origin</span>
                  <div className="font-mono text-xs text-slate-200 break-all">
                    https://github.com/PiyushBorban49/serviceNow-event.git
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Target Branch</span>
                  <div className="font-mono text-xs text-emerald-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>main</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-semibold text-slate-300">Git Execution Log & Instructions</h4>
                <div className="font-mono text-xs text-slate-400 space-y-1 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="text-emerald-400">$ echo "# serviceNow-event" &gt;&gt; README.md</div>
                  <div className="text-emerald-400">$ git init</div>
                  <div className="text-emerald-400">$ git add .</div>
                  <div className="text-emerald-400">$ git commit -m "Initialize ServiceNow Event Management workbench"</div>
                  <div className="text-emerald-400">$ git branch -M main</div>
                  <div className="text-emerald-400">$ git remote add origin https://github.com/PiyushBorban49/serviceNow-event.git</div>
                  <div className="text-emerald-400">$ git push -u origin main</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        <p>serviceNow-event • Interactive ITOM Event Simulator & Ingestion Workbench</p>
      </footer>
    </div>
  );
}
