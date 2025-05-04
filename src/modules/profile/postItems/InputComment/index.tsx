import { QUERY_KEY } from "~/definitions/models";

interface IProps {
  detailPost: any;
  isSubComment?: boolean;
  commentId?: string;
  listSubComments?: ISubComments[];
  handleReplySubComment?: (value: string) => void;
  focusSpecificComment?: boolean;
}

const TooltipTime = ({ time, t }: any) => (
  <Tooltip title={dayjs(time).format('HH:mm MMMM DD, YYYY')}>
    {formatTimeCreatedAt(time, t)}
  </Tooltip>
);

const PostComment = ({
  isSubComment = false,
  commentId,
  detailPost,
  listSubComments = [],
  handleReplySubComment,
  focusSpecificComment = false,
}: IProps) => {
  const router = useRouter();
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  const [showInput, setShowInput] = useState<string[]>([]);
  const [editCommentIds, setEditCommentIds] = useState<string[]>([]);
  const focusedComment = useRef(false);
  const t = useTranslations();

  // Render sub-comments
  const renderSubComments = () => (
    listSubComments.map((subComment: ISubComments) => (
      <div key={subComment._id} className="mt-2 w-full">
        <div className="flex items-start">
          <Avatar 
            src={subComment.author.avatar}
            onClick={() => handleClickMyPage(subComment.author._id, router)}
          />
          <div className="ml-2 flex-1">
            <div className="p-2 bg-gray-100 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {subComment.author.first_name} {subComment.author.last_name}
                </span>
                <span className="text-xs text-gray-500">
                  <TooltipTime time={subComment.createdAt} t={t} />
                </span>
              </div>
              <p className="mt-1">{subComment.content}</p>
            </div>
            <div className="mt-1 flex justify-between items-center">
              <button 
                className="text-xs text-blue-600 hover:underline"
                onClick={() => handleReplySubComment?.(subComment.author.user_name)}
              >
                {t('post.comments.reply')}
              </button>
            </div>
          </div>
        </div>
      </div>
    ))
  );

  // Render main comments
  const renderListComment = (comments: any) => (
    comments?.pages?.[0]?.data?.map((comment: any) => (
      <div key={comment._id} className="mb-4">
        <div className="flex items-start">
          <Avatar 
            src={comment.author.avatar}
            onClick={() => handleClickMyPage(comment.author._id, router)}
          />
          <div className="ml-2 flex-1">
            <div className="p-2 bg-gray-100 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {comment.author.first_name} {comment.author.last_name}
                </span>
                <span className="text-xs text-gray-500">
                  <TooltipTime time={comment.createdAt} t={t} />
                </span>
              </div>
              <p className="mt-1">{comment.content}</p>
            </div>
            <div className="mt-1 flex justify-between items-center">
              <button
                className="text-xs text-blue-600 hover:underline"
                onClick={() => setShowInput([...showInput, comment._id])}
              >
                {t('post.comments.reply')}
              </button>
            </div>
            
            {/* Sub-comments */}
            {comment.comments?.length > 0 && (
              <div className="mt-2 ml-4">
                {renderSubComments()}
              </div>
            )}

            {/* Reply input */}
            {showInput.includes(comment._id) && (
              <InputComment
                onSend={(content) => {
                  handleSendMessage(comment._id, content);
                  setShowInput([]);
                }}
              />
            )}
          </div>
        </div>
      </div>
    ))
  );

  const handleSendMessage = async (parentId: string, content: string) => {
    try {
      await community.createComment(detailPost._id, {
        content,
        parentId,
        mentions: [] // You can add mention logic here
      });
      queryClient.invalidateQueries(QUERY_KEY.LIST_COMMENT);
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="comment-container">
      {renderListComment(detailPost.comments)}
    </div>
  );
};
