import { PostMedia } from "~/definitions/interfaces/post.interface";

export const regexYoutubeLink =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;

export const regexVideoMultipeSocial =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})|(?:https?:\/\/)?(?:www\.)?(?:facebook\.com\/(?:watch\/?\?v=\d+|video\.php\?v=\d+|.+?\/videos\/\d+))|(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|tv|reel)\/[\w-]+|(?:https?:\/\/)?(?:www\.)?tiktok\.com\/(?:@[\w.-]+\/video\/[\d]+)|(?:https?:\/\/)?(?:www\.)?twitch\.tv\/(?:videos\/[\d]+|[\w.-]+\/clip\/[\w-]+)|(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:[\d]+)|(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\/(?:BV[\w-]+)|(?:https?:\/\/)?(?:www\.)?v\.qq\.com\/(?:x\/cover\/\w+\/\w+)|(?:https?:\/\/)?(?:www\.)?v\.youku\.com\/v_show\/id_([\w-]+)/gi;

export const convertLinksToAnchors = (input: any) => {
  // Regex để tìm các liên kết
  const urlRegex = /https?:\/\/[^\s]+/g;

  // Hàm thay thế các liên kết bằng thẻ <a>
  return input
    ?.replace(urlRegex, function (url: any) {
      return `<a href="${url}" target="_blank" style="color:#1677ff;" >${url}</a>`;
    })
    ?.replace(/\r\n|\n/g, '<br>');
};

export const parseMedia = (url: string): PostMedia => {
  const fileName = url.split('/').pop() || '';
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  return {
    url,
    name: fileName,
    type: ['gif', 'png', 'jpeg', 'jpg'].includes(ext)
      ? 'image'
      : ['mp4', 'mpeg', 'mov'].includes(ext)
        ? 'video'
        : 'file',
    id: undefined,
  };
};
export const parseFile = (file: any): PostMedia  => {
  return {
    url: file.url,
    name: file.name,
    type: 'file',
    id: undefined,
  };
};
