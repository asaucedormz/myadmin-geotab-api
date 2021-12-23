
const rest = require('msw').rest
const setupServer = require('msw/node').setupServer

const server = setupServer(
	rest.post(process.env.GEOTAB_SANDBOX_URL, (req, res, ctx) => {
		switch(req.body.method) {
			case 'GetCountries': {
				return res(
					ctx.status(200),
					ctx.json({ result: ['Canada', 'Philippines', 'United States'] })
					)
				}
			break
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
			break
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
)

module.exports = server
