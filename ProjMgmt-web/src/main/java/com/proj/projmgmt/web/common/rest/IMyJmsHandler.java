package com.proj.projmgmt.web.common.rest;

import javax.jms.JMSException;
import java.io.Serializable;

/**
 * Created by Shukla, Sachin. on 3/10/15.
 */
public interface IMyJmsHandler {

    public void sendMessage(final Serializable object) throws JMSException;
}
