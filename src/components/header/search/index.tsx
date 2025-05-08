import { Avatar, List, Popover } from 'antd';
import { useRef, useState } from 'react';
import { useSearchStore } from '~/stores/search.data';
import styles from '../styles.module.scss';
import { useRouter } from 'next/navigation';
import InputSearch from '~/common/inputSearch';
import useDebounce from '~/hooks/useDebounce';
import Button from '~/components/form/Button';
import { CloseOutlined } from '@ant-design/icons';
export default function Search() {
  const { searchHistory, addSearch, removeSearch } = useSearchStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const handleSearch = useDebounce(async (value: string) => {
    if (!value) {
      setSearchResults([]);
      return;
    }
    // Gọi API search
    const results = await fetch(`/api/search?q=${value}`).then((res) => res.json());
    setSearchResults(results);
  }, 300);
  const handleSearchSelect = (user: any) => {
    addSearch(user.name);
    router.push(`/profile/${user.id}`);
    setSearchQuery('');
    setSearchResults([]);
  };
  const searchContent = (
    <div className={styles.searchPopover}>
      {searchQuery ? (
        <List
          dataSource={searchResults}
          renderItem={(item) => (
            <List.Item onClick={() => handleSearchSelect(item)}>
              <Avatar src={item.avatar} />
              <span>{item.name}</span>
            </List.Item>
          )}
        />
      ) : (
        <>
          <div className={styles.recentSearchesHeader}>
            <span>Recent searches</span>
            <Button type="link">See all</Button>
          </div>
          <List
            dataSource={searchHistory}
            renderItem={(item, index) => (
              <List.Item>
                <span>{item}</span>
                <Button type="text" icon={<CloseOutlined />} onClick={() => removeSearch(index)} />
              </List.Item>
            )}
          />
        </>
      )}
    </div>
  );
  return (
    <Popover
      content={searchContent}
      trigger="click"
      open={!!searchQuery || document.activeElement === searchInputRef.current}
    >
      <InputSearch
        className={styles.headerSearch}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          handleSearch(e.target.value);
        }}
      />
    </Popover>
  );
}
