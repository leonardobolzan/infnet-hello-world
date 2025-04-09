# infnet-hello-world

## Docker Swarm

### Máquinas na AWS

- node-1 (manager)
- node-2 (worker)
- node-3 (worker)
- node-4 (worker)

### Serviços

| Serviço               | Descrição                            |
| --------------------- | ------------------------------------ |
| infnet_app            | Aplicação NodeJS rodando na porta 80 |
| cache_redis           | Redis para cache                     |
| monitoring_grafana    | Grafana rodando na porta 3000        |
| monitoring_prometheus | Prometheus rodando na porta 9090     |

### Volumes

| Volume                     | Descrição                 |
| -------------------------- | ------------------------- |
| cache_redis_data           | Volume para o Redis       |
| monitoring_grafana_data    | Volume para o Grafana     |
| monitoring_prometheus_data | Volume para o Prometheus  |

### Rotas

- IMPORTANTE: Como foram utilizadas instâncias EC-2 na AWS (Free Tier), o IP público muda toda vez que as instâncias são interrompidas :)
- Utilize o IP apenas como um exemplo de rota.

| Link                                       | Rota                        | Descrição                                 |
| ------------------------------------------ | --------------------------- | ----------------------------------------- |
| [App](http://3.22.188.212)                 | http://3.22.188.212         | Aplicação acessível na porta 80 (default) |
| [Health Check](http://3.22.188.212/health) | http://3.22.188.212/health  | Health Check da aplicação                 |
| [Metrics](http://3.22.188.212/metrics)     | http://3.22.188.212/metrics | Métricas da aplicação                     |
| [Prometheus](http://3.22.188.212:9090)     | http://3.22.188.212:9090    | Prometheus acessível na porta 9090        |
| [Grafana](http://3.22.188.212:3000)        | http://3.22.188.212:3000    | Grafana acessível na porta 3000           |

### Stress Test

Para testes de carga utilizamos o [autocannon](https://www.npmjs.com/package/autocannon).

```
npm install -g autocannon
autocannon -c 100 -d 30 http://3.22.188.212:80
```
