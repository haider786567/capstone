import { k8sCoreV1Api } from "./config.js";


export async function createPod(sandboxId) {
    const podManifest = {
        metadata: {
            name: `sandbox-pod-${sandboxId}`,
            labels: {
                sandboxId: sandboxId
            }
        },
        spec: {
            volumes: [
                {
                    name: 'workspace-volume',
                    emptyDir: {}
                }
            ],
            initContainers: [
                {
                    name: 'init-container',
                    image: 'template',
                    command: ['sh', '-c', 'cp -r /workspace/. /seed/'],
                    volumeMounts: [
                        {
                            name: 'workspace-volume',
                            mountPath: '/seed'
                        }
                    ]
                }
            ],
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
                    },
                    volumeMounts: [
                        {
                            name: 'workspace-volume',
                            mountPath: '/workspace'
                        }
                    ]

                },
                {
                    image: 'agent',
                    name: 'agent-container',
                    imagePullPolicy: 'IfNotPresent',
                    ports: [
                        {
                            containerPort: 3000,
                            name: 'http'
                        }
                    ],
                    resources: {
                        requests: {
                            cpu: '250m',
                            memory: '500Mi'
                        },
                        limits: {
                            cpu: '500m',
                            memory: '1Gi'
                        },
                        
                        
                    },
                    volumeMounts: [
                        {
                            name: 'workspace-volume',
                            mountPath: '/workspace'
                        }
                    ]
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

export async function deletePod(sandboxId) {
    const response = await k8sCoreV1Api.deleteNamespacedPod({
        namespace: 'default',
        name: `sandbox-pod-${sandboxId}`
    },{
        gracePeriodSeconds: 0
    });
    return response;
}
