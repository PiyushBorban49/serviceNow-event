# serviceNow-event

A modern ServiceNow Event Management (ITOM) event ingestion, payload validation, and event-to-alert processing workbench.

## Features
- **Event Ingestion Simulation**: Test and craft JSON payloads for ServiceNow's Table API (`/api/now/table/em_event`) and ITOM Event Multi-insert API (`/api/global/em/jsonv2`).
- **Standard ServiceNow Event Fields**:
  - `source` (e.g., SolarWinds, Datadog, AWS CloudWatch, Splunk, Dynatrace, Azure Monitor)
  - `node` (CI hostname / IP / FQDN)
  - `type` (Metric or event type, e.g., CPUUtilization, DiskSpace, ServiceDown)
  - `resource` (Disk C:, eth0, Port 443, etc.)
  - `severity` (0: Clear, 1: Critical, 2: Major, 3: Minor, 4: Warning, 5: Info)
  - `metric_name` & `metric_value`
  - `description` & `additional_info`
- **Event Rules & Alert Generation**: Interactive rule simulator showing how events get deduplicated into Alerts (`em_alert`) and mapped into Incidents (`incident`).
- **REST & cURL Generator**: One-click generation of cURL, Python, and JavaScript snippets ready to send into a ServiceNow instance.
- **Payload Templates**: Built-in real-world templates for CloudWatch, Prometheus/Alertmanager, Datadog, Kubernetes, and Custom Webhooks.

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## GitHub Repository
- Remote: `https://github.com/PiyushBorban49/serviceNow-event.git`
