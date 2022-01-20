import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
	rest.post('https://myadminapitest.geotab.com/v2/MyAdminApi.ashx', (req, res, ctx) => {
		switch(JSON.parse(decodeURIComponent(req.body.substring(9))).method) {
			case 'Authenticate': {
				return res(
					ctx.status(200), 
					ctx.json({
						result: {
							sessionId: 'a session Id',
							userId: 'a userId',
						}
					})
				)		
			}
			case 'GetCountries': {
				return res(
					ctx.status(200),
					ctx.json({
						result: ['Canada', 'Philippines', 'United States']
						})
					)
				}
			case 'GetStates': {
				return res(
					ctx.status(200),
					ctx.json({
						result: ['Alberta','any other province','British Columbia']
					})
				)
			}
			case '': {
				return res(
				ctx.status(200),
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
			default: return {}
		}
	})
)

module.exports = server
