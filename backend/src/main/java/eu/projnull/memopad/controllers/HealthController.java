package eu.projnull.memopad.controllers;

import eu.projnull.memopad.controllers.dto.HealthResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    @Operation(summary = "Health check endpoint")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Server is running")
    })
    public HealthResponse getHealth() {
        return new HealthResponse("OK");
    }
}



