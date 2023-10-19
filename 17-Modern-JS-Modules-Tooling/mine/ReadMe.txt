1) Install npm
    Verify by checking version
    > npm -v
    Then do the initialization
    > npm init

    
2) Trying out installation of modules like leaflet. After installation you can check the package.json file; also see th node_modules folder with relevant js files downloaded

    >npm install leaflet

3) Trying out installation of es modules like lodash. 
   The normal version of lodash would require CommonJS related steps for it to be used in the code. Therefore we are 
   installing the -es variant. After this installation you can import the required exported values in your script. 
   In the current example, cloneDeep is used as an example 

    >npm install lodash-es

4) For bundling we are using 'parcel'. Install using the below command

    >npm install parcel --save-dev

5) Now you can run the below command to pack the dependencies into one 

    syntax:     >npx parcel <Starting_file_name>
    Example :   >npx parcel index.html

6) After you added the below to the package.json
    "scripts": {
        "start": "parcel index.html"
    },
    Parcel can be run by the below 
   > npm run start
7) For compressing, we can add the below to  package.json

    "scripts": {
        "start": "parcel index.html",
        "build" : "parcel build index.html"
    },  

    Parcel can be run by the below 
   > npm run build