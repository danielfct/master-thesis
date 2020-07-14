package andre.replicationmigration.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/")
public class AppController {

	@RequestMapping(value = "html")
	public String giveMePlainHtml() {
		return "html";
	}
	
	@RequestMapping(value = {"/", "/ui/**"})
	public String root() {
		return "indexreact";
	}	

	@RequestMapping(value = "/execute")
	public String executeCommand() {
		return "executecommand";
	}	
	
	@RequestMapping(value = "/newservice")
	public String launchService() {
		return "launchservice";
	}
		
}
