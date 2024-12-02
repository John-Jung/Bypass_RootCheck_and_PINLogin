Java.perform(function() {
	
	console.log("[+] Starting root detection bypass...");
	Java.perform(function () {
		 
		// Shell 명령어 체크 후킹
		try {
			var ProcessBuilder = Java.use("java.lang.ProcessBuilder");
			// start() 메소드를 후킹
			ProcessBuilder.start.implementation = function() {
				// 실행하려는 명령어를 가져옴
				var cmd = this.command.value.toString();
				console.log("[*] ProcessBuilder command:", cmd);
				// su나 which 같은 루트 관련 명령어인지 확인
				if (cmd.includes("su") || cmd.includes("which")) {
					console.log("[*] Blocked ProcessBuilder command:", cmd);
					// 루트 관련 명령어면 에러를 발생시켜 실행을 막음
					throw new Error("Command blocked");
				}
				return this.start();
			};
		} catch(e) {
			console.log("[!] Failed to hook ProcessBuilder:", e);
		}
	});
	
    console.log("[*] Starting Dynamic Activity & Method Tracer...");
    
    // Activity 클래스 후킹
    var Activity = Java.use("android.app.Activity");
    
    // 모든 Activity의 onCreate 후킹
    Activity.onCreate.overload('android.os.Bundle').implementation = function(savedInstanceState) {
        console.log("\n[+] Activity Created: " + this.getClass().getName());
        return this.onCreate(savedInstanceState);
    };
    
    // onResume 후킹
    Activity.onResume.implementation = function() {
        console.log("\n[+] Activity Resumed: " + this.getClass().getName());
        return this.onResume();
    };

    // 모든 메소드 호출 추적
    var targetClass = "com.dki.spb_android";
    
    Java.enumerateLoadedClasses({
        onMatch: function(className) {
            if (className.startsWith(targetClass)) {
                console.log("[*] Found target class: " + className);
                
                try {
                    var clazz = Java.use(className);
                    var methods = clazz.class.getDeclaredMethods();
                    
                    methods.forEach(function(method) {
                        var methodName = method.getName();
                        
                        try {
                            clazz[methodName].implementation = function() {
                                console.log("\n[+] Method Called: " + className + "." + methodName);
                                console.log("[*] Arguments:");
                                for (var i = 0; i < arguments.length; i++) {
                                    console.log("\targ[" + i + "]: " + arguments[i]);
                                }
                                
                                // 원래 메소드 호출
                                var retval = this[methodName].apply(this, arguments);
                                
                                console.log("[*] Return Value:", retval);
                                return retval;
                            };
                        } catch(err) {
                            // 오버로드된 메소드 처리
                            if (err.message.includes("has more than one overload")) {
                                method.getParameterTypes().toString().split(",").forEach(function(param) {
                                    console.log("\t[*] Parameter type:", param);
                                });
                            }
                        }
                    });
                } catch(err) {
                    console.log("[-] Error hooking class:", className, err);
                }
            }
        },
        onComplete: function() {
            console.log("[*] Class enumeration complete");
        }
    });

    // Intent 모니터링
    Activity.startActivity.overload('android.content.Intent').implementation = function(intent) {
        if (intent) {
            console.log("\n[+] Starting new Activity via Intent");
            console.log("[*] Intent details:");
            console.log("\tAction: " + intent.getAction());
            console.log("\tComponent: " + (intent.getComponent() ? intent.getComponent().getClassName() : "null"));
            console.log("\tFlags: " + intent.getFlags());
            
            var extras = intent.getExtras();
            if (extras) {
                console.log("\tExtras:");
                var keys = extras.keySet();
                keys.forEach(function(key) {
                    console.log("\t\t" + key + " => " + extras.get(key));
                });
            }
        }
        return this.startActivity(intent);
    };

    console.log("[*] Dynamic tracer installed. Waiting for activity...");
});