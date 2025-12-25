# Docker Quick Reference for OSM Submit

## Starting the Application
```bash
docker compose up -d
```
This will:
- Build the Docker image (first time only)
- Start the container in detached mode
- Make the app available at http://localhost:3000

## Stopping the Application
```bash
docker compose down
```

## Rebuilding After Changes
If you make code changes and want to rebuild:
```bash
docker compose up -d --build
```

## Viewing Logs
```bash
docker compose logs -f
```

## Checking Container Status
```bash
docker compose ps
```

## Removing Everything (including volumes)
```bash
docker compose down -v
```

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, edit `docker-compose.yml` and change:
```yaml
ports:
  - "3000:80"
```
to use a different port, for example:
```yaml
ports:
  - "8080:80"
```

### Rebuild from Scratch
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```
