package com.proj.projmgmt.server.common.service;

import com.proj.projmgmt.vo.common.DummyVO;
import org.springframework.stereotype.Component;

/**
 * Created by Shukla, Sachin. on 3/8/15.
 */

@Component
public class PersonService implements IPersonService{


    @Override
    public DummyVO getDummyObj() {
        return DummyVO.getObj();
    }
}
