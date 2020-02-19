package pt.unl.fct.microservicemanagement.mastermanager;

import org.hamcrest.Matchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServicesController;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServicesService;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.BDDMockito;
import org.springframework.http.HttpHeaders;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = ServicesController.class, secure=false)
public class ServicesTests {

  @Autowired
  private MockMvc mvc;
  @MockBean
  private ServicesService servicesService;

  private ServiceEntity frontEndService() {
    return ServiceEntity.builder()
        .serviceName("front-end")
        .dockerRepository("front-end")
        .defaultExternalPort("8079").defaultInternalPort("80")
        .defaultDb("NOT_APPLICABLE")
        .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname}")
        .minReplics(1).maxReplics(0)
        .outputLabel("${front-endHost}")
        .serviceType("frontend")
        .expectedMemoryConsumption(209715200d)
        .build();
  }

  public void testGetService(ServiceEntity testService) throws Exception {
    BDDMockito.given(servicesService.getService(testService.getServiceName())).willReturn(testService);
    mvc.perform(MockMvcRequestBuilders.get("http://localhost:8080/services/" + testService.getServiceName()))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.header().string(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_UTF8_VALUE))
        .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_VALUE))
        .andExpect(MockMvcResultMatchers.jsonPath("$serviceName", Matchers.is(testService.getServiceName())))
        .andExpect(MockMvcResultMatchers.jsonPath("$dockerRepository", Matchers.is(testService.getDockerRepository())))
        .andExpect(MockMvcResultMatchers.jsonPath("$defaultExternalPort", Matchers.is(testService.getDefaultExternalPort())))
        .andExpect(MockMvcResultMatchers.jsonPath("$defaultInternalPort", Matchers.is(testService.getDefaultInternalPort())))
        .andExpect(MockMvcResultMatchers.jsonPath("$defaultDb", Matchers.is(testService.getDefaultDb())))
        .andExpect(MockMvcResultMatchers.jsonPath("$launchCommand", Matchers.is(testService.getLaunchCommand())))
        .andExpect(MockMvcResultMatchers.jsonPath("$minReplics", Matchers.is(testService.getMinReplics())))
        .andExpect(MockMvcResultMatchers.jsonPath("$maxReplics", Matchers.is(testService.getMaxReplics())))
        .andExpect(MockMvcResultMatchers.jsonPath("$outputLabel", Matchers.is(testService.getOutputLabel())))
        .andExpect(MockMvcResultMatchers.jsonPath("$serviceType", Matchers.is(testService.getServiceType())))
        .andExpect(MockMvcResultMatchers.jsonPath("$expectedMemoryConsumption", Matchers.is(testService.getExpectedMemoryConsumption())))
        .andDo(MockMvcResultHandlers.print());
    Mockito.verify(servicesService, Mockito.times(1)).getService(testService.getServiceName());
  }

  @Test
  public void testAddService() throws Exception {

  }

  @Test
  public void testUpdateService() throws Exception {
    var testService = frontEndService();
    testGetService(testService);
  }

  @Test
  public void testNotFoundService() throws Exception {
    var testService = frontEndService();
    var serviceNameThatDoesntExist = "service-name-that-doesnt-exist";
    BDDMockito.given(servicesService.getService(testService.getServiceName())).willReturn(testService);
    mvc.perform(MockMvcRequestBuilders.get("http://localhost:8080/services/" + serviceNameThatDoesntExist))
        .andExpect(MockMvcResultMatchers.status().isNotFound())
        .andDo(MockMvcResultHandlers.print());
    Mockito.verify(servicesService, Mockito.times(1)).getService(serviceNameThatDoesntExist);
  }


}
