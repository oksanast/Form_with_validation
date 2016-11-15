var peselRegexp = new RegExp("^\\d{11}$");
var passwordRegexp = new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{7,}$");

$(document).ready(function () {

    $("#birthdate").blur(function() {
        var value = $("#birthdate").val();
        var error_string = document.createElement("small");
        error_string.append("A birthday isn't valid");
        if (value == "") {
            return;
        }
        var input = new Date(value);
        if (input.getFullYear() < 1900 || isNaN(input)) {
            if (document.getElementById("li_birthdate").childElementCount == 2)
                document.getElementById("li_birthdate").appendChild(error_string);
        }
        else {
            if (document.getElementById("li_birthdate").childElementCount > 2)
                document.getElementById("li_birthdate").lastChild.remove();
        }
    });

    $("#password").blur(function () {
        var input = $(this).val();
        var error_string = document.createElement("small");
        error_string.append("Password must contain at least 7 characters (including both small and capital letters and at least one digit)");
        if (!passwordRegexp.test(input)) {
            if (document.getElementById("li_password").childElementCount == 2)
                document.getElementById("li_password").appendChild(error_string);
        }
        else {
            if (document.getElementById("li_password").childElementCount > 2)
                document.getElementById("li_password").lastChild.remove();
        }
    });

    $("#confirm_password").blur(function () {
        var input = $(this).val();
        var error_string = document.createElement("small");
        error_string.append("Passwords don't match.");
        if (input !== $("#password").val()) {
            if (document.getElementById("li_confirm_password").childElementCount == 2)
                document.getElementById("li_confirm_password").appendChild(error_string);
        }
        else {
            if (document.getElementById("li_confirm_password").childElementCount > 2)
                document.getElementById("li_confirm_password").lastChild.remove();
        }
    });

    function peselValidation(input) {
        if (peselRegexp.test(input) == false) {
            return false;
        }
        else {
            var pes = input.split("");
            var kontrola = (parseInt(pes[0]) + 3 * parseInt(pes[1]) + 7 * parseInt(pes[2])
                + 9 * parseInt(pes[3]) + parseInt(pes[4]) + 3 * parseInt(pes[5])
                + 7 * parseInt(pes[6]) + 9 * parseInt(pes[7]) + parseInt(pes[8]) + 3 * parseInt(pes[9])) % 10;
            if (kontrola == 0)
                kontrola = 10;
            kontrola = 10 - kontrola;
            return parseInt(pes[10]) == kontrola;
        }
    }

    $("#pesel").blur(function () {
        var input = $(this).val();
        var error_string = document.createElement("small");
        error_string.append("The valid PESEL is required");
        if (input === "" || peselValidation(input)) {
            if (document.getElementById("li_pesel").childElementCount > 2)
                document.getElementById("li_pesel").lastChild.remove();
        }
        else {
            if (document.getElementById("li_pesel").childElementCount == 2)
                document.getElementById("li_pesel").appendChild(error_string);
        }
        if (parseInt(input.charAt(9)) % 2 == 1) {
            $('input:radio[name="sex"]').filter('[value="Male"]').attr('checked', true);
            $('input:radio[name="sex"]').filter('[value="Female"]').attr('checked', false);
        }
        else {
            $('input:radio[name="sex"]').filter('[value="Male"]').attr('checked', false);
            $('input:radio[name="sex"]').filter('[value="Female"]').attr('checked', true);
        }
    });

    $("#login").blur(function () {
        var error_string = document.createElement("small");
        error_string.append("Login is already taken");
        $.ajax({
            type: "GET",
            url: "http://edi.iem.pw.edu.pl/bach/register/check/" + $("#login").val(),
            success: function (data) {
                if (data[$("#login").val()]) {
                    if (document.getElementById("li_login").childElementCount == 2)
                        document.getElementById("li_login").appendChild(error_string);
                }
                else {
                    if (document.getElementById("li_login").childElementCount > 2)
                        document.getElementById("li_login").lastChild.remove();
                }
            },
            timeout: 60000,
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        })
    });

    $("#Submit").click(function() {
        var error_string = document.createElement("p");
        if (document.getElementsByTagName("small").length != 0) {
            error_string.append("The form is not valid");
            if (document.getElementById("li_submit").childElementCount == 1)
                document.getElementById("li_submit").appendChild(error_string);
            else
                document.getElementById("li_submit").replaceChild(error_string,
                    document.getElementById("li_submit").lastChild);
        }
        else {
            var empty = false;
            error_string.append("Please fill in all fields");
            $(':input[required]', $("#registration")).each(function () {
                if (this.value.trim() === '') {
                    empty = true;
                    if (document.getElementById("li_submit").childElementCount == 1)
                        document.getElementById("li_submit").appendChild(error_string);
                    else
                        document.getElementById("li_submit").replaceChild(error_string,
                            document.getElementById("li_submit").lastChild);
                }
            });
            if (!empty)
                $("#registration").submit();
        }
    });

})