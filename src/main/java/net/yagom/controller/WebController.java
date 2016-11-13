package net.yagom.controller;

import org.apache.log4j.Logger;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@EnableAutoConfiguration
public class WebController {
    private final Logger logger = Logger.getLogger(WebController.class);

    @RequestMapping("/web/upload")
    public String testUpload(Model model) {
        return "upload";
    }
}
