package com.proj.projmgmt.web.common.rest;

import com.proj.projmgmt.server.common.service.IMessageSenderService;
import com.proj.projmgmt.server.common.service.IPersonService;
import com.proj.projmgmt.vo.common.DummyVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.jms.JMSException;

/**
 * Created by Shukla, Sachin. on 3/8/15.
 */

@Controller
@RequestMapping("/restservice")
public class DummyController {

    @Autowired
    private IPersonService personService;

    @Autowired
    private IMessageSenderService messageSenderService;

//    @Autowired
    private IMyJmsHandler myJmsHandler;

    @RequestMapping(value = "/dummyobj", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody DummyVO getDummyObj () {
        return personService.getDummyObj();
    }

    @RequestMapping(value = "/getRandom4DigitOtp/{phoneNumber}", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody String getRandom4DigitOtp (@PathVariable String phoneNumber) {
        System.out.println("phoneNumber = "+phoneNumber);
        int val = (int) (Math.random()*10000);
        String returnVal = String.valueOf(val);
        if(returnVal.length() == 3){
            returnVal = "0"+returnVal;
        }else if(returnVal.length() == 2){
            returnVal = "00"+returnVal;
        }

        try{
            messageSenderService.sendSMS(phoneNumber, returnVal);
        }catch(Exception ex){
            returnVal = "ERR-"+returnVal+"-"+ex.getMessage();
            ex.printStackTrace();
        }
        return returnVal;
    }


    @RequestMapping(value = "/testJMS/{count}", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody String testJMS (@PathVariable int count) {
        String val = "this is success";
        try {
            for(int i=0;i<count;i++){
                myJmsHandler.sendMessage(val+" - "+(i+1));
            }

        } catch (JMSException e) {
            e.printStackTrace();
        }

        return val;
    }


}
