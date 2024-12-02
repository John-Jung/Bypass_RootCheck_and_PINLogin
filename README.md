# 루팅 탐지, 핀 로그인 우회

| 도구명 | 용도 |
|:--------:|:------:|
| JADX | 디컴파일 툴 |
| Frida | 안드로이드 메소드 변조 툴 |

명령어: ```frida -Uf 패키지_이름 -l example.js```

## su 명령어, 즉 관리자 권한 명령어로 루팅 탐지를 하는것으로 확인

![루트 체크 함수 식별2](https://github.com/user-attachments/assets/7bc1626c-c3c6-4d81-9fbb-2eefc96ca561)

### isrooted.js 실행

![frida 실행 마스킹](https://github.com/user-attachments/assets/b1d22415-7576-4ce8-af02-3e3675b1dc56)

## PIN 로그인 시 어떤 엑티비티, 메소드가 호출되는지 dynamicTracking.js을 통해 확인

![로그인 트랙킹](https://github.com/user-attachments/assets/9b12ca21-55ee-425d-8ece-ec219b6d648a)

해당 앱은 webview로 http 통신을 하는것으로 확인. 또한, "SUCESS", "FAIL" 을 응답값 통해 PIN 로그인 성공 유무를 판단

PIN 로그인 실패를 하면 PinActivity로 돌아가고

PIN 로그인 성공하면 NaverMapActivity와 위도(latitude) 경도(longitude) 넘어가는것을 확인

응답값을 항상 "SUCCESS"로 수정하면 PIN 로그인 우회 성공

## bypassPin.js 실행

![로그인 성공 cmd 마스킹](https://github.com/user-attachments/assets/0f45a490-3594-4d18-ab4d-11795029ef93)

위도 경도가 나오는것을 보고 PIN 로그인 우회 성공
