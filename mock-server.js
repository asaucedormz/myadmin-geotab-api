
const rest = require('msw').rest
const setupServer = require('msw/node').setupServer

const server = setupServer(
	// calls that do not require parameter inputs
	rest.post(process.env.GEOTAB_SANDBOX_URL, (req, res, ctx) => {
		switch(req.body.method) {
			case 'GetCountries': {
				return res(
					ctx.status(200),
					ctx.json({
						result: ['Canada', 'Philippines', 'United States']
						})
					)
				
				}
			case 'GetDevicePlans': {
				const forAccount = req.body.params.forAccount
				return res(
					ctx.status(200),
					ctx.json({
						result: ['an id', 'a level', true]
					})
				)
			}
			case '': {
				return res(
				ctx.status(500),
				ctx.json({
					result: {
						error: {
							message: 'An error has occurred and this string contains info.',
							name: 'MissingMethodException'
						}
					}
				})
				)
			}
			// return a default so our tests don't error out
			default: {
				return res(
					ctx.status(200), 
					ctx.json({
						result: {
							among_other_things: 'this result contains sessionId and userId, below',
							sessionId: 'a session Id',
							userId: 'a userId',
						}
					})
				)		
			}
		}
	})
	// call for request
)

module.exports = server
