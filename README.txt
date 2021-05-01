Apache on Mac

tail -f /var/log/apache2/error_log
tail -f /var/log/apache2/access_log

/etc/httpd.conf
^^^^^^^^^^^^^^^
<IfModule !mpm_prefork_module>
	LoadModule cgid_module libexec/apache2/mod_cgid.so
</IfModule>
<IfModule mpm_prefork_module>
	LoadModule cgi_module libexec/apache2/mod_cgi.so
</IfModule>
LoadModule userdir_module libexec/apache2/mod_userdir.so
LoadModule alias_module libexec/apache2/mod_alias.so
LoadModule rewrite_module libexec/apache2/mod_rewrite.so

ServerName 127.0.0.1:80

  AddHandler cgi-script .cgi

Include /private/etc/apache2/extra/httpd-userdir.conf
#
# UserDir Sites
#
Include /private/etc/apache2/users/mark.conf
#
# <Directory /Users/mark/Sites>
#     Options Indexes MultiViews ExecCGI
#     AllowOverride All
#     Require all granted
# </Directory>
#

sudo /bin/bash
apachectl restart

http://localhost/~mark/react003/
