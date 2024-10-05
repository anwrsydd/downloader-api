const axios = require("axios");
const cheerio = require("cheerio");

class Downloader {
  constructor() {
    this.xConf = {
      url: "https://api.x.com/graphql/sCU6ckfHY0CyJ4HFjPhjtg/TweetResultByRestId",
      headers: {
        authority: "api.x.com",
        Accept: "/",
        authorization:
          "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
        "content-type": "application/json",
        cookie:
          'guest_id=v1%3A170169557192618161; night_mode=2; guest_id_marketing=v1%3A170169557192618161; guest_id_ads=v1%3A170169557192618161; gt=1842407227946381368; personalization_id="v1_B/aekPTcTIGReRdt/3STyA=="',
        origin: "https://x.com",
        referer: "https://x.com/",
        "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
        "x-client-transaction-id":
          "AXyz1upv/yaLdxKKUSwgDsFlWLu7MC3zYIshR2JHoN6YffGYpnDyn7VDYhweuANv0bdOsANe3kmv17elP7bEGu3bPZA2Ag",
        "x-guest-token": "1842407227946381368",
        "x-twitter-active-user": "yes",
        "x-twitter-client-language": "id",
      },
      params:
        "features=%7B%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22communities_web_enable_tweet_community_results_fetch%22%3Atrue%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22articles_preview_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22creator_subscriptions_quote_tweet_preview_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22rweb_video_timestamps_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D&fieldToggles=%7B%22withArticleRichContentState%22%3Atrue%2C%22withArticlePlainText%22%3Afalse%2C%22withGrokAnalyze%22%3Afalse%2C%22withDisallowedReplyControls%22%3Afalse%7D",
    };
  }

  async tiktok(url) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const obj = JSON.parse(
      $("script#__UNIVERSAL_DATA_FOR_REHYDRATION__").get()[0].children[0].data
    );
    return obj.__DEFAULT_SCOPE__[
      "webapp.video-detail"
    ].itemInfo.itemStruct.video.bitrateInfo.map((v) => {
      return {
        bitrate: v.Bitrate,
        size: v.PlayAddr.DataSize,
        media: {
          height: v.PlayAddr.Height,
          width: v.PlayAddr.Width,
          url: v.PlayAddr.UrlList[2],
        },
      };
    });
  }
  async x(tweetId) {
    const twtVar = {
      tweetId,
      withCommunity: false,
      includePromotedContent: false,
      withVoice: false,
    };

    const { data } = await axios.get(
      this.xConf.url +
        "?variables=" +
        encodeURIComponent(JSON.stringify(twtVar)) +
        "&" +
        this.xConf.params,
      { headers: this.xConf.headers }
    );
    return data.data.tweetResult.result.legacy.entities.media.map((v) => {
      if (v.type === "photo") {
        return {
          type: v.type,
          url: v.media_url_https + "?name=large",
          width: v.sizes.large.w,
          height: v.sizes.large.h,
        };
      } else if (v.type === "video") {
        return {
          type: v.type,
          url: v.video_info.variants.filter(
            (v) => v.content_type === "video/mp4"
          ),
        };
      } else {
        return v;
      }
    });
  }
}

module.exports = Downloader;
