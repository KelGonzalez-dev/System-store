<?php

namespace GuajiraBags\Helpers;

class JwtHelper
{
    public static function encode(array $payload, string $key): string
    {
        $header = self::base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $body   = self::base64UrlEncode(json_encode($payload));
        $sig    = self::base64UrlEncode(hash_hmac('sha256', "$header.$body", $key, true));
        return "$header.$body.$sig";
    }

    public static function decode(string $token, array $jwtConfig): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$headerB64, $payloadB64, $sigB64] = $parts;
        $expected = self::base64UrlEncode(
            hash_hmac('sha256', "$headerB64.$payloadB64", $jwtConfig['key'], true)
        );

        if (!hash_equals($expected, $sigB64)) {
            return null;
        }

        $payload = json_decode(self::base64UrlDecode($payloadB64), true);
        if (!$payload) {
            return null;
        }

        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null;
        }

        if (($payload['iss'] ?? '') !== $jwtConfig['issuer']) {
            return null;
        }

        if (($payload['aud'] ?? '') !== $jwtConfig['audience']) {
            return null;
        }

        return $payload;
    }

    public static function extractBearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
            ?? '';

        if (preg_match('/Bearer\s+(\S+)/i', $header, $matches)) {
            return $matches[1];
        }

        return null;
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
