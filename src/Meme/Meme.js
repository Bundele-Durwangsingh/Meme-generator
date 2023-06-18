import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

const Meme = () => {
    const [memes, setMemes] = useState([]);
    const [memeIndex, setMemeIndex] = useState(0);
    const [captions, setCaptions] = useState([]);
    const navigate = useNavigate();

    const updateCaption = (e, index) => {
        const text = e.target.value || '';
        setCaptions(
            captions.map((c, i) => {
                if (index === i) {
                    return text;
                } else {
                    return c;
                }
            })
        );
    };

    const genrateMeme = () => {
        const currentMeme = memes[memeIndex];
        const formData = new FormData();

        formData.append('username', 'drag11');
        formData.append('password', 'dRAG11@#');
        formData.append('template_id', currentMeme.id);
        captions.forEach((c, index) =>
            formData.append(`boxes[${index}][text]`, c)
        );

        fetch('https://api.imgflip.com/caption_image', {
            method: 'POST',
            body: formData,
        }).then((res) => {
            res.json().then((res) => {
                navigate(`/generated?url=${res.data.url}`);
            });
        });
    };

    const shuffleMemes = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    };

    useEffect(() => {
        fetch('https://api.imgflip.com/get_memes').then((res) =>
            res.json().then((res) => {
                const _memes = res.data.memes;
                shuffleMemes(_memes);
                setMemes(_memes);
            })
        );
    }, []);

    useEffect(() => {
        if (memes.length) {
            setCaptions(Array(memes[memeIndex].box_count).fill(''));
        }
    }, [memeIndex, memes]);

    useEffect(() => {
        console.log(captions);
    }, [captions]);

    return memes.length ? (
        <div className={styles.container}>
            <button onClick={genrateMeme} className={styles.generate}>
                Generate
            </button>
            <button onClick={() => setMemeIndex(memeIndex + 1)} className={styles.skip}>
                Skip
            </button>
            {captions.map((c, index) => (
                <input onChange={(e) => updateCaption(e, index)} key={index} />
            ))}
            {memes[memeIndex] && <img src={memes[memeIndex].url} alt="Meme" />}
        </div>
    ) : null;
};

export default Meme;
