package es.startuphero.rest.app.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author cenk
 */
@Api(value = "Sample", description = "Sample Endpoints")
@RestController
@RequestMapping("api/sample")
public class SampleController {

  @ApiOperation(value = "Sample")
  @GetMapping
  public String sample() {
    return "Sample";
  }
}
