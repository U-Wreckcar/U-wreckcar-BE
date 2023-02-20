module.exports =
{
    auth: async (req, res, next) => {
        // const { authorization } = req.headers;
        if (!authorization) {
            return res.status(400).json({
                isSuccess: false,
                msg: '토큰 정보가 없습니다.',
            });
        }
    },

    asyncWrapper: (asyncFn) => {
        return async (req, res, next) => {
          try {
            return await asyncFn(req, res, next);
          } catch (error) {
            console.error(error);
            return res.status(500).json({
              isSuccess: false,
              msg: 'Internal Server Error',
            });
          }
        };
      },
}