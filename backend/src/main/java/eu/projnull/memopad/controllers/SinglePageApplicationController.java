package eu.projnull.memopad.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class SinglePageApplicationController {
    @GetMapping("/")
    public String index() {
        return "forward:/static/index.html";
    }
}
