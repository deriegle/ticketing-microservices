# Ticketing microservices

## Add `ingress-nginx` controller when using Docker for Mac

[Additional Instructions](https://kubernetes.github.io/ingress-nginx/deploy/)

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/cloud/deploy.yaml
```

## Add ENVVARS

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```
