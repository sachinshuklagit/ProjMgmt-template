PROJMGMT_HOME=/Users/sachin/Documents/workspace/MyProj/ProjMgmt-static

DOC_ROOT=/Library/WebServer/Documents
PROJMGMT_WEB_FOLDER_NAME=projmgmtweb

cd $PROJMGMT_HOME
/Users/sachin/Softwares/apache-maven-3.2.1/bin/mvn clean install -o

cd $DOC_ROOT'/'$PROJMGMT_WEB_FOLDER_NAME
rm -rf projmgmt.zip

cp $PROJMGMT_HOME'/target/ProjMgmt.zip' $DOC_ROOT'/'$PROJMGMT_WEB_FOLDER_NAME
unzip -o projmgmt.zip

echo 'Done.....Done'
