'use strict'

class AccessController {
    signUp = async (req,res,next) => {
        try {
            console.log(`[p]::signUp:::`,req.body);
            return res.status(201).json({
                code : '20001',
                metadata : {userid : 1}

            })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AccessController()