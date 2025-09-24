
import { Inject, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private readonly at_expiry = '1h';
    private readonly rt_expiry = '7d';
    constructor (@Inject() private readonly jwt: JwtService){}
    async use(req: Request, res: Response, next: NextFunction) {
        const access_jwt = this.extractTokenFromHeader(req, "authorization");
        if (!access_jwt) {
            throw new UnauthorizedException();
        }
        try {
            const payload = this.jwt.verify(access_jwt, {secret: process.env.ACCESS_JWT_SECRET,  maxAge: this.at_expiry} );
            req['user'] = payload;
            return next()
        } catch (error){
            if (!(error instanceof TokenExpiredError)){
                throw new UnauthorizedException();
            }
            const refresh_jwt = this.extractTokenFromHeader(req, "refresh-token");
            if (!refresh_jwt) {
                throw new UnauthorizedException();
            }
            const {accessToken, refreshToken} = await this.refreshToken(refresh_jwt);
            res.setHeader("x-access-token",accessToken);
            res.setHeader("x-fresh-token",refreshToken);
            return next();
        }
    }

    private extractTokenFromHeader(request: Request, type_of_token: "authorization"|"refresh-token"): string | undefined {
        const [type, token] = (request.headers[type_of_token] as string)?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private async refreshToken(refresh_token: string){
        try {
            const payload = await this.jwt.verifyAsync(refresh_token, {secret: process.env.REFRESH_JWT_SECRET, maxAge: this.rt_expiry});
            
            return await this.createTokens(payload);
        } catch (error){
            throw new UnauthorizedException();
        }
    }
    private async createTokens(payload) {

        const accessToken = await this.jwt.signAsync(payload, {secret: process.env.ACCESS_JWT_SECRET, expiresIn: this.at_expiry});

        const refreshToken = await this.jwt.signAsync(payload, {secret: process.env.REFRESH_JWT_SECRET, expiresIn: this.rt_expiry});


        return { accessToken, refreshToken };
    }
}
