package eu.projnull.memopad.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class SinglePageApplicationController {
    @GetMapping("/{path:^(?!static|api)(?!.*\\.[a-zA-Z0-9]+$).+}/**")
    public String anyPath() {
        return "forward:/";
    }

    @GetMapping("/")
    public String index() {
        return "forward:/static/index.html";
    }
}
