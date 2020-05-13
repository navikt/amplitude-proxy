

```
kubectl config use-context labs-gcp
kubectl config use-context prod-gcp
kubectl -ndataplattform create secret generic project-keys --from-file=./secrets/project-keys.json 
kubectl -ndataplattform get secret 
kubectl -ndataplattform describe secrets/project-keys 

kubectl -ndataplattform  delete secret project-keys
```
