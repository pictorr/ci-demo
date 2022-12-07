# Start/Restart App
1. Start App
```pm2 start npm -- start```
2. Restart App
```pm2 stop all```a
```pm2 start all```

# Database Migration
1. install mongo-migrate globally
```npm i -g migrate-mongo```
2. create and edit config file
```migrate-mongo init```
2. create new migration
```migrate-mongo create myMigration```
3. run all migrations
```migrate-mongo up``` 

# New setup
1. copy .env.dev to .env
```cp .env.dev .env```
2. modify .env file

# Database Daily Backup
1. create script file
```touch db_script.sh```
2. make it executable
```chmod +x db_script.sh```
3. script includes DB dump command 
```mongodump -h $DB_HOST -d $DB_NAME -u $DB_USER -p $DB_PASS -o $DEST```
4. (optional) script includes delete older directories/files command
```find /home/ubuntu/backups/* -type d -ctime +10 -exec rm -rf {} \;```
5. display crontab
```crontab -l```
6. add/modify crontab
```crontab -e```

# Translation files
## JSON to XLSX
1. Use an online tool such as https://data.page/json/csv
2. Convert .json to .csv (copy content)
3. Open file with speadsheet client (e.g. Microsoft Office, LibreOffice etc.)
4. By default, the content is imported on columns, we want them on rows
    - copy content
    - create new tab
    - in new tab, use "paste special" and select "transpose" option
## XLSX to JSON - reverse process
1. Open .xlsx file
2. "transpose" content from rows to columns (use separate tabs)    
3. Export .csv file
4. User an online tool to convert .csv to .json format
5. copy .json content to app
## store original files - save files in translations directory

# Docker Gotenberg Image
Docker Image: https://hub.docker.com/r/gotenberg/gotenberg
Useful commands:
1. check docker service
```sudo systemctl status docker```
2. check running containers
```docker ps``` and ```docker ps --all```
3. stop container
```docker stop <ContainerId>```
4. delete container
```docker rm <ContainerId>```
5. start container remote server
```docker run -d --rm -p 3060:3000 gotenberg/gotenberg:7```
6. start container locally
```docker run --name siniat-gotenberg -p 127.0.0.1:3060:3000 -d gotenberg/gotenberg:7```
In node app use port 3060 or change if needed
7. check convert xlsx to pdf is working
```curl --request POST http://localhost:3060/forms/libreoffice/convert --form files=@/home/developer/server/uploads/example.xlsx -o uploads/example.pdf```
