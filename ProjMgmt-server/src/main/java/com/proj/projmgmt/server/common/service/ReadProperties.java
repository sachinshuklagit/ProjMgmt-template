package com.proj.projmgmt.server.common.service;

import java.io.InputStream;
import java.util.Properties;

/**
 * Created by Shukla, Sachin. on 3/9/15.
 */
public class ReadProperties {

    private static Properties props = null;

    public static Properties getProperties(){

        if(props == null){
            loadPropertiesFromAppConfig();
        }

        return props;
    }

    private static void loadPropertiesFromAppConfig(){
        props = new Properties();
        try{
            InputStream is = ReadProperties.class.getResourceAsStream("/app-config.properties");
            props.load(is);
        }catch(Exception ex){
            ex.printStackTrace();
        }
    }

}
