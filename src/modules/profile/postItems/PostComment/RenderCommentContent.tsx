import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { convertLinksToAnchors, convertSwitchDecIcons } from '~/models/community';
import { handleClickMyPage } from '~/utils/helper';

const RenderCommentContent = ({ styles, comment, subComment }: any) => {
  const [isDetail, setIsDetail] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations();
  const mentionName = subComment?.mentions[0]?.mentionName;

  const commentShow = mentionName
    ? `<div id="${mentionName}-openProfileInfo" class="replyComment">@${mentionName}</div>${comment.split(mentionName)[1] || ''}`
    : comment;

  useEffect(() => {
    const element = document.getElementById(`${mentionName}-openProfileInfo`);

    const handleClick = () => {
      if (mentionName) {
        handleClickMyPage(
          subComment?.mentions[0]?.representationObject,
          subComment?.mentions[0]?.uuid,
          subComment?.mentions[0]?.representationId,
          router,
        );
      }
    };

    if (element) {
      element.addEventListener('click', handleClick);
      return () => element.removeEventListener('click', handleClick);
    }
  });

  return (
    <div>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html:
            commentShow?.length > 500 && !isDetail
              ? convertLinksToAnchors(convertSwitchDecIcons(commentShow)?.slice(0, 500) + '... ')
              : convertLinksToAnchors(convertSwitchDecIcons(commentShow)),
        }}
      ></div>
      {commentShow?.length > 500 && !isDetail && (
        <span
          className="text-sm not-italic font-bold text-base-blue-400 cursor-pointer"
          onClick={() => setIsDetail(true)}
        >
          {isDetail ? '' : t('seeMore')}
        </span>
      )}
    </div>
  );
};
export default RenderCommentContent;
