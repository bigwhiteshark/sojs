@echo start build service...
@echo off
java -jar compiler.jar --js=../src/so.js --js_output_file=../dist/so.js --charset=utf-8  --compilation_level=ADVANCED_OPTIMIZATIONS

@echo complete build!!!
