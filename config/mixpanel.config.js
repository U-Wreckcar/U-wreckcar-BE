import Mixpanel from 'mixpanel'
import {signupForCompanyController} from '../src/controllers/user/uwreckcarAccount.js';

const mixpanel = Mixpanel.init(`${process.env.MIXPANEL_API}`)

export function trackUserProfile(req, res, next) {
    try {
        const requestData = {
            path: req.path,
            method: req.method,
            user_agent: req.headers['user-agent'],
            ip: req.ip,
            body: req.body,
        };

        mixpanel.track('유저프로필', requestData);

        next();
    } catch (err) {
        console.error(err);
        next();
    }
}

export function trackSetNewPassword(req, res, next) {
    try {
        const requestData = {
            path: req.path,
            method: req.method,
            user_agent: req.headers['user-agent'],
            ip: req.ip,
            body: req.body,
        };

        mixpanel.track('비밀번호재설정', requestData);

        next();
    } catch (err) {
        console.error(err);
        next();
    }
}

export function trackSignupForCompany(req, res, next) {
    try {
        const requestData = {
            path: req.path,
            method: req.method,
            user_agent: req.headers['user-agent'],
            ip: req.ip,
            body: req.body,
        };

        mixpanel.track('유렉카회원가입', requestData);

        next();
    } catch (err) {
        console.error(err);
        next();
    }
}

export function trackExportCsv(req, res, next) {
    try {
        const requestData = {
            path: req.path,
            method: req.method,
            user_agent: req.headers['user-agent'],
            ip: req.ip,
            body: req.body,
        };

        mixpanel.track('CSV추출', requestData);

        next();
    } catch (err) {
        console.error(err);
        next();
    }
}

export function trackExportExcel(req, res, next) {
    try {
        const requestData = {
            path: req.path,
            method: req.method,
            user_agent: req.headers['user-agent'],
            ip: req.ip,
            body: req.body,
        };

        mixpanel.track('Excel추출', requestData);

        next();
    } catch (err) {
        console.error(err);
        next();
    }
}

export function trackUTMFilter(req, res, next) {
    try {
        const requestData = {
            path: req.path,
            method: req.method,
            user_agent: req.headers['user-agent'],
            ip: req.ip,
            body: req.body,
        };

        mixpanel.track('UTM필터', requestData);

        next();
    } catch (err) {
        console.error(err);
        next();
    }
}

export function trackUpdateMemo(req, res, next) {
    try {
        const requestData = {
            path: req.path,
            method: req.method,
            user_agent: req.headers['user-agent'],
            ip: req.ip,
            body: req.body,
        };

        mixpanel.track('메모수정하기', requestData);

        next();
    } catch (err) {
        console.error(err);
        next();
    }
}

export function trackAllUTM(req, res, next) {
    try {
        const requestData = {
            path: req.path,
            method: req.method,
            user_agent: req.headers['user-agent'],
            ip: req.ip,
            body: req.body,
        };

        mixpanel.track('전체UTM조회', requestData);

        next();
    } catch (err) {
        console.error(err);
        next();
    }
}

export function trackDeleteUTM(req, res, next) {
    try {
        const requestData = {
            path: req.path,
            method: req.method,
            user_agent: req.headers['user-agent'],
            ip: req.ip,
            body: req.body,
        };

        mixpanel.track('UTM삭제하기', requestData);

        next();
    } catch (err) {
        console.error(err);
        next();
    }
}

export function trackCreateUTM(req, res, next) {
    try {
        const requestData = {
            path: req.path,
            method: req.method,
            user_agent: req.headers['user-agent'],
            ip: req.ip,
            body: req.body,
        };

        mixpanel.track('UTM생성하기', requestData);

        next();
    } catch (err) {
        console.error(err);
        next();
    }
}

export function trackExternalUTM(req, res, next) {
    try {
        const requestData = {
            path: req.path,
            method: req.method,
            user_agent: req.headers['user-agent'],
            ip: req.ip,
            body: req.body,
        };

        mixpanel.track('외부UTM추가하기', requestData);

        next();
    } catch (err) {
        console.error(err);
        next();
    }
}