Component
  instance variables:
    props
    state
  methods:
    setState()
    forceUpdate()
  called during mounting:
    constructor()
	  ;; set this.state directly, do not call setState()
	static getDerivedStateFromProps()
	render()
	componentDidMount()
  called during updating:
    static getDerivedStateFromProps()
	shouldComponentUpdate(nextProps, nextState): boolean
	  this is for performance optimizations
	render()
	getSnapshotBeforeUpdate()
	componentDidUpdate()
  called during unmounting:
    componentWillUnmount()

  error boundary

  React.useState()
JSX

state
hook

Add-Ons
  react-router

//
// Function Component
//

export const InputFC: React.FC<{ label: string } > = ({ label }) => {
  const name = "x"
  const [state, setState] = React.useState("4711") // state hook, can only be called from within a function component
  return <div className="inputWithLabel">
    <label htmlFor={name}>{`${label} "${state}"`}</label>
    <input id={name} name={name} value={state} onChange={(event) => setState(event.target.value)}/>
  </div>
}

//
// Class Component
//

interface InputXState {
  value: string
}

interface InputXProps {
  label: string
}

class InputCC extends React.Component<InputXProps, InputXState> {
  constructor(props: InputXProps) {
    super(props)
    this.state = {value: "4711"}
  }
  render(): React.ReactNode {
    const name = "x"
    return <div className="inputWithLabel">
    <label htmlFor={name}>{`${this.props.label} "${this.state.value}"`}</label>
    <input id={name} name={name} value={this.state.value} onChange={(event) => this.setState({value: event.target.value})}/>
  </div>
  }
}


inputmode & pattern may not work on safari, polyfill?

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
