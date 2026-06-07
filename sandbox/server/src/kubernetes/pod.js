import { k8sCoreV1Api } from "./config.js";

export async function createPod(sandboxId) {
    const podManifest = {
        metadata: {
            name: `sandbox-pod-${sandboxId}`,
            labels: {
                app: 'sandbox-preview',
                sandboxId: sandboxId
            }
        },
        spec: {
            containers: [
                {
                    image: 'template',
                    name: 'sandbox-container',
                    imagePullPolicy: 'IfNotPresent',
                    ports: [
                        {
                            containerPort: 5173,
                            name: 'http'
                        }
                    ],
                    resources: {
                        requests: {
                            cpu: '100m',
                            memory: '128Mi'
                        },
                        limits: {
                            cpu: '200m',
                            memory: '256Mi'
                        }
                    }
                }
            ]
        } 
    }

    const response = await k8sCoreV1Api.createNamespacedPod({
        namespace: 'default',
        body: podManifest
    });
    return response;



}

