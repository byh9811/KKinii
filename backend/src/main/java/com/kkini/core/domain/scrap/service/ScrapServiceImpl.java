package com.kkini.core.domain.scrap.service;

import com.kkini.core.domain.member.entity.Member;
import com.kkini.core.domain.member.repository.MemberRepository;
import com.kkini.core.domain.post.entity.Post;
import com.kkini.core.domain.scrap.dto.request.AddScrapRequestDto;
import com.kkini.core.domain.scrap.entity.Scrap;
import com.kkini.core.domain.scrap.repository.ScrapRepository;
import com.kkini.core.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

@Service
@Transactional(readOnly = true)
@Slf4j
@RequiredArgsConstructor
public class ScrapServiceImpl implements ScrapService{

    private final MemberRepository memberRepository;
    private final PostRepository postRepository;
    private final ScrapRepository scrapRepository;

    @Override
    public void addScrap(AddScrapRequestDto addScrapRequestDto) {
        Member member = memberRepository.findById(addScrapRequestDto.getMemberId()).orElseThrow(
                () -> new NotFoundException(Member.class, addScrapRequestDto.getMemberId()));
        Post post = postRepository.findById(addScrapRequestDto.getPostId()).orElseThrow(
                () -> new NotFoundException(Member.class, addScrapRequestDto.getPostId()));
        Scrap scrap = scrapRepository.save(Scrap.builder()
                .member(member)
                .post(post)
                .build());
    }

    @Override
    public void deleteScrap(Long id) {
        Scrap scrap = scrapRepository.findById(id).orElseThrow(() -> new NotFoundException(Scrap.class, id));
        Scrap deleteScrap = scrapRepository.deleteById(scrap);
    }
}
