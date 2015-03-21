# Addon 1 #
### View external css/js files for firefox ###

simple extention that replace the extention '[viewJS](http://downloads.mozdev.org/xsidebar/mods/jsview-2.0.8-mod.xpi)' that no more work (FF 32) since
the cahce service was [depracted](http://downloads.mozdev.org/xsidebar/mods/) (used to get the file size )

## Download ##
[https://addons.mozilla.org/en-US/firefox/addon/show-external-cssjs-files/](https://addons.mozilla.org/en-US/firefox/addon/show-external-cssjs-files/)



---



---



---



# Addon 2 #
### Show host ip for firefox ###
firefox addon to reverse (resolve) ip from hostname ([showip](https://addons.mozilla.org/fr/firefox/addon/showip/) addons alternative)

Simple extention that convert hostname from the url bar and show the reverse ip (at the moment from a provider)
and show it in the addon bar  (at the bottom)

this is an alternative for the famus : showip addon

and after finding some banners and ads in some website i decided to create my own addons


## Download ##
**[https://addons.mozilla.org/en-US/firefox/addon/show-host-ip/](https://addons.mozilla.org/en-US/firefox/addon/show-host-ip/)**




Privacy concerns over popular ShowIP Firefox add-on

Filed Under: Featured, Firefox, Privacy

ShowIPA popular Firefox add-on appears to have started leaking private information about every website that users visit to a third-party server, including sensitive data which could identify individuals or reduce their security.

Naked Security reader Rob Sanders alerted us to the activities of the recently updated ShowIP add-on for the Firefox browser.

According to the description on the Mozilla add-ons website, ShowIP is designed to "show the IP address(es) of the current page in the status bar. It also allows querying custom information services by IP (right click) and hostname (left click), like whois, netcraft, etc. Additionally you can copy the IP address to the clipboard."

Currently over 170,000 people are said to be using ShowIP.

What the add-on's description doesn't say is that since version 1.3 (released on April 19th 2012) it has also sent - unencrypted - the full URL of sites visited using HTTPS, and sites viewed in Private Browsing mode, to a site called ip2info.org.

The user never realises that the data has been shared with a third-party, unless they use special tools to monitor what data is being sent from their computer.

SophosLabs researcher Xiaochuan Zhang examined the add-on, and observed the potential privacy breach in action. In the following example, he used Wireshark to view the network packets being sent and observed his request to visit a non-existent website "www.thisisapparentlyafakeservice.me" being shared with ip2info.org.

Wireshark results

The full URL of every webpage visited is sent to the Germany-based ip2info.org website, using unencrypted connections.

In addition, the add-on has no warning that sites you visit might be disclosed, no privacy policy small print explaining its behaviour, and no apparent way to opt-out of the data-sharing.

ShowIP settings

Sanders told Naked Security that the issue was reported on the add-on's Google Code project page on 22nd April, but has received no response. Despite the alert, version 1.4 of the ShowIP add-on has since been released - and still exhibits the same behaviour.

Warning posted about privacy issue

Sanders said that he hoped the apparent privacy lapse was the case of naivety rather than a developer with more malicious intentions:

> "I suspect it's the work of a very naive developer, but who knows nowadays. What bothers me most is how this code managed to get approved on the Mozilla Addons site (not once, but twice) and how it's still there 12 days later."

The ip2info.org website itself appears to be very new, having only been registered a month ago.

IP2Info WHOIS

And who appears to have registered the domain? A Berlin-based link marketing firm.

Hats On Marketing firm

Hmm.

We have asked the developers of ShowIP to comment on the apparent privacy issue, and will update this article with any response we receive.

Update: Mozilla has rolled the version of ShowIP they make available on their add-on site back to 1.0. They say they are working with the developer on correcting the issue. Hopefully in future their review process will flag privacy issues like this one to prevent users' data being potentially exposed.


[Published at sophos.com](http://nakedsecurity.sophos.com/2012/05/01/privacy-concern-showip-firefox-add-on/)