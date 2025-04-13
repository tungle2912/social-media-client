"use client";
import { Avatar, Button, Divider, Modal, Select } from "antd";
import Image from "next/image";
import { useState } from "react";
import { Posts } from "~/constants/posts";
import InputCreatPost from "~/modules/profile/inputCreatePost";
import PostItem from "~/modules/profile/postItems";
import image from "../../../../public/static/image";
import styles from "./styles.module.scss";
import {
  AllConnectedIcon,
  OnlyMeIcon,
  PublicIcon,
  SmileIcon,
  SomePeopleIcon,
  TagIcon,
} from "~/common/icon";
import { commentScopeType, UserType, ViewScopeType } from "~/definitions";
import { useTranslations } from "next-intl";
import { useDimension } from "~/hooks";
interface iPostTab {
  userProfile: UserType;
}
const viewScopeOptions = [
  {
    value: ViewScopeType.PUBLIC,
    label: (
      <div className={styles.permissionItems}>
        <PublicIcon />
        <p>Anyone can view</p>
      </div>
    ),
  },
  {
    value: ViewScopeType.FOLLOWERS,
    label: (
      <div className={styles.permissionItems}>
        <AllConnectedIcon />
        <p>Followers</p>
      </div>
    ),
  },
  {
    value: ViewScopeType.SOME_PEOPLE,
    label: (
      <div className={styles.permissionItems}>
        <SomePeopleIcon />
        <p>Someone can view</p>
      </div>
    ),
  },
  {
    value: ViewScopeType.PRIVATE,
    label: (
      <div className={styles.permissionItems}>
        <OnlyMeIcon />
        <p>Only me</p>
      </div>
    ),
  },
];

const commentScopeOptions = [
  {
    value: commentScopeType.PUBLIC,
    label: (
      <div className={styles.permissionItems}>
        <PublicIcon />
        <p>Anyone can comment</p>
      </div>
    ),
  },
  {
    value: commentScopeType.FOLLOWERS,
    label: (
      <div className={styles.permissionItems}>
        <AllConnectedIcon />
        <p>Followers</p>
      </div>
    ),
  },
  {
    value: commentScopeType.SOME_PEOPLE,
    label: (
      <div className={styles.permissionItems}>
        <SomePeopleIcon />
        <p>Someone can comment</p>
      </div>
    ),
  },
  {
    value: commentScopeType.PRIVATE,
    label: (
      <div className={styles.permissionItems}>
        <OnlyMeIcon />
        <p>Only me</p>
      </div>
    ),
  },
];

export default function PostTab({ userProfile }: iPostTab) {
  const  t  = useTranslations();
  const { isSM } = useDimension()
  const [isOpenModal, setIsOpenModal] = useState(false);
  return (
    <div className={styles.postsTab}>
      {!isSM && (
        <div className={styles.leftSidebar}>
          <div className={styles.aboutSection}>
            <h3>{t("about")}</h3>
            <button className={styles.addButton}>{t("addBio")}</button>
            <ul className={styles.infoList}>
              <li>
                {t("studiedAt", {
                  school: userProfile?.school || t("notUpdated"),
                })}
              </li>
              <li>
                {t("livesAt", {
                  location: userProfile?.location || t("notUpdated"),
                })}
              </li>
              <li>
                {t("from", {
                  hometown: userProfile?.hometown || t("notUpdated"),
                })}
              </li>
            </ul>
            <button className={styles.editButton}>{t("editDetails")}</button>
          </div>
          <div className={styles.imagesSection}>
            <div className={styles.imagesSectionHeader}>
              <h3>{t("photos")}</h3>
              <a href="#" className={styles.viewAllImage}>
                {t("viewAllPhotos")}
              </a>
            </div>
            <div className={styles.imageContainer}>
              <Image
                width={100}
                height={100}
                alt={t("imageAlt")}
                src="https://res.cloudinary.com/dflvvu32c/image/upload/v1724148262/goftpolyqmy08gmpwmdn.jpg"
                className={styles.imageAvatar}
              />
            </div>
          </div>
          <div className={styles.friendsSection}>
            <div className={styles.friendsSectionHeader}>
              <h3>{t("friends")}</h3>
              <a href="#" className={styles.viewAllFriendsLink}>
                {t("viewAllFriends")}
              </a>
            </div>
            <div className={styles.friendContainer}>
              <Image
                width={100}
                height={100}
                alt={t("friendAvatarAlt")}
                src="https://res.cloudinary.com/dflvvu32c/image/upload/v1724148262/goftpolyqmy08gmpwmdn.jpg"
                className={styles.friendAvatar}
              />
            </div>
          </div>
        </div>
      )}
      <div className={styles.mainContent}>
        <div className={styles.createPost}>
          <div className={styles.inputCreatPost}>
            <Avatar
              size={50}
              src={userProfile?.avatar || ""}
              className={styles.userAvatar}
            />
            <InputCreatPost setIsOpenModal={setIsOpenModal} />
          </div>
          <div className={styles.listAttach}>
            <div className={styles.item}>
              <Image
                src={image.videoAndImage}
                width={26.67}
                height={26.67}
                alt={t("photoVideo")}
              />
              <span>{t("photoVideo")}</span>
            </div>
            <div className={styles.item}>
              <Image
                src={image.attachment}
                width={26.67}
                height={26.67}
                alt={t("attachmentAlt")}
              />
              <span>{t("attachment")}</span>
            </div>
          </div>
        </div>
        <div className={styles.managePosts}>
          <Button className={styles.filterButton}>{t("filter")}</Button>
        </div>
        <div className={styles.postsList}>
          {Posts.map((post) => (
            <PostItem
              key={post.id}
              name={post.name}
              timeAgo={post.timeAgo}
              content={post.content}
              image={post.image}
            />
          ))}
        </div>
      </div>
      <Modal
        title="Create a post"
        centered
        open={isOpenModal}
        className={styles.modalCreatePost}
        onCancel={() => {
          setIsOpenModal(false);
        }}
      >
        <div className={styles.createPostContainer}>
          <div className={styles.createPostContent}>
            <div className={styles.userInfo}>
              <Avatar
                src="https://res.cloudinary.com/dflvvu32c/image/upload/v1739413637/kaz83swuhggnsi0exrk3.jpg"
                alt="Avatar"
                className={styles.avatar}
              />
              <div className={styles.userDetails}>
                <p className={styles.username}>Tung le</p>
                <div className={styles.privacySettings}>
                  <Select
                    defaultValue={viewScopeOptions[0].value}
                    style={{ width: 160 }}
                    options={viewScopeOptions}
                  />
                  <Select
                    defaultValue={commentScopeOptions[0].value}
                    style={{ width: 160 }}
                    options={commentScopeOptions}
                  />
                </div>
              </div>
            </div>

            <textarea
              className={styles.textArea}
              placeholder="Write something here ..."
            ></textarea>

            <div className={styles.emojiTag}>
              <div className={styles.btnAddEmoji}>
                <SmileIcon />
                Add emoji
              </div>
              <div className={styles.btnAddTag}>
                <TagIcon />
                Add Tag
              </div>
            </div>
          </div>

          <div className={styles.createPostFooter}>
            <div className={styles.divider}>
              <span className={styles.dividerText}>Add to your post</span>
            </div>
            <div className={styles.attach}>
              <div className={styles.item}>
                <Image
                  src={image.videoAndImage}
                  width={26.67}
                  height={26.67}
                  alt={t("photoVideo")}
                />
                <span>{t("photoVideo")}</span>
              </div>
              <div className={styles.item}>
                <Image
                  src={image.attachment}
                  width={26.67}
                  height={26.67}
                  alt={t("attachmentAlt")}
                />
                <span>{t("attachment")}</span>
              </div>
            </div>
            <div className={styles.actionButtons}>
              <button
                className={styles.saveButton}
                onClick={() => {
                  setIsOpenModal(false);
                }}
              >
                Cancel
              </button>
              <button className={styles.postButton}>Post</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
