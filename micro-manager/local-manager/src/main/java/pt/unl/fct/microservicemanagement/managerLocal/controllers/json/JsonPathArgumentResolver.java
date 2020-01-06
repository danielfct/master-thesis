/*
 * MIT License
 *
 * Copyright (c) 2020 micro-manager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pt.unl.fct.microservicemanagement.managerLocal.controllers.json;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.IOUtils;
import org.springframework.core.MethodParameter;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.jayway.jsonpath.JsonPath;

public class JsonPathArgumentResolver implements HandlerMethodArgumentResolver{

    private static final String JSON_BODY_ATTRIBUTE = "JSON_REQUEST_BODY";

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(JsonValue.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        final var body = getRequestBody(webRequest);
        final var annotation = parameter.getParameterAnnotation(JsonValue.class);
        final var path = StringUtils.isEmpty(annotation.value()) ? parameter.getParameter().getName() : annotation.value();
        return JsonPath.read(body, path);
    }

    private String getRequestBody(NativeWebRequest webRequest) {
        final HttpServletRequest servletRequest = webRequest.getNativeRequest(HttpServletRequest.class);
        var jsonBody = (String) servletRequest.getAttribute(JSON_BODY_ATTRIBUTE);
        if (jsonBody == null) {
            try {
                jsonBody = IOUtils.toString(servletRequest.getInputStream(), StandardCharsets.UTF_8);
                servletRequest.setAttribute(JSON_BODY_ATTRIBUTE, jsonBody);
            }
            catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        return jsonBody;
    }

}