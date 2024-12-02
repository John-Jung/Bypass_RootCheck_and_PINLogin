Java.perform(function () {
	
console.log("[+] Starting root detection bypass...");

Java.perform(function() {

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

console.log("[+] Root detection bypass installed");

});
